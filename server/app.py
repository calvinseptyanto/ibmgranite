import os
import json
from flask import Flask, request, jsonify


# ------------------ LangChain / IBM Watsonx Imports ------------------
from langchain_ibm import WatsonxEmbeddings, WatsonxLLM
from langchain_chroma import Chroma

from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.prompts import PromptTemplate
from langchain.tools import tool
from langchain.tools.render import render_text_description_and_args
from langchain.agents.output_parsers import JSONAgentOutputParser
from langchain.agents.format_scratchpad import format_log_to_str
from langchain.agents import AgentExecutor
from langchain.memory import ConversationBufferMemory
from langchain_core.runnables import RunnablePassthrough

from ibm_watson_machine_learning.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import EmbeddingTypes
from dotenv import load_dotenv

load_dotenv()

# ------------------ Flask App Initialization ------------------
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Allow all origins
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})
app.config["UPLOAD_FOLDER"] = "./uploaded_pdfs"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# ------------------ Define Watsonx Embeddings/LLM ------------------
# Load environment variables
IBM_API_KEY = os.getenv("IBM_WATSONX_APIKEY")
IBM_PROJECT_ID = os.getenv("IBM_WATSONX_PROJECT_ID")
IBM_URL = os.getenv("IBM_WATSONX_URL")

# Create Watsonx Embeddings
embeddings = WatsonxEmbeddings(
    model_id="ibm/granite-embedding-107m-multilingual",
    url=IBM_URL,
    apikey=IBM_API_KEY,
    project_id=IBM_PROJECT_ID,
)

# Create Watsonx LLM
llm = WatsonxLLM(
    model_id="ibm/granite-3-8b-instruct",
    url=IBM_URL,
    apikey=IBM_API_KEY,
    project_id=IBM_PROJECT_ID,
    params={
        GenParams.DECODING_METHOD: "greedy",
        GenParams.TEMPERATURE: 0,
        GenParams.MIN_NEW_TOKENS: 5,
        GenParams.MAX_NEW_TOKENS: 400,
        GenParams.STOP_SEQUENCES: ["Human:", "Observation"],
    },
)

# ------------------ Create the VectorStore (Initially Empty) ------------------
vectorstore = Chroma(
    collection_name="agentic-rag-chroma",
    embedding_function=embeddings  # We will set the embedding function once we have it
)

# We prepare a text_splitter outside for reusability.
text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
    chunk_size=500,
    chunk_overlap=0
)


def retrieve_context(query: str, k: int = 5) -> str:
    """
    Retrieve up to k relevant chunks from the vectorstore for the given query.
    """
    retriever = vectorstore.as_retriever()
    docs = retriever.get_relevant_documents(query)
    top_k_docs = docs[:k]
    context = "\n\n".join(doc.page_content for doc in top_k_docs)
    return context

# ------------------ Preamble ------------------


full_text = ""


def _load_and_add_pdfs(pdf_paths):
    """
    1) Load each PDF via PyPDFLoader
    2) Accumulate their text in global 'full_text'
    3) Split docs and add them to the vectorstore
    """
    global full_text

    all_docs = []
    for path in pdf_paths:
        loader = PyPDFLoader(path)
        docs = loader.load()
        all_docs.extend(docs)

        # Collect raw text from each doc's page_content
        for d in docs:
            full_text += d.page_content + "\n"

    # Split docs for embedding in Chroma
    doc_splits = text_splitter.split_documents(all_docs)

    # Add to the existing vectorstore
    vectorstore.add_documents(doc_splits)
    # If using persist:
    # vectorstore.persist()


# ------------------ Global State ------------------
# Check if the folder exists and is not empty
upload_folder = app.config["UPLOAD_FOLDER"]
pdf_files = [os.path.join(upload_folder, f)
             for f in os.listdir(upload_folder) if f.endswith('.pdf')]
if pdf_files:
    pdfs_loaded = True
    _load_and_add_pdfs(pdf_files)
else:
    pdfs_loaded = False
    full_text = ""


# ------------------ Tools for the Agent ------------------


@tool
def agreement_qa(question: str) -> str:
    """Answers questions about the agreement based on the provided question."""
    context = retrieve_context(question, k=5)
    local_prompt = (
        f"You are an expert in analyzing legal agreements. Based on the following excerpts from the agreement, "
        f"provide a clear and concise answer to the question: '{question}'. If the context does not contain "
        f"sufficient information to answer the question, say 'The provided agreement excerpts do not contain "
        f"enough information to answer this question.' "
        f"Do not make assumptions beyond the given context.\n\n"
        f"Context: {context}"
    )
    response = llm.invoke(local_prompt)
    return response.strip()


@tool
def compliance_obligations_list() -> str:
    """Lists compliance obligations for each party in JSON format."""
    query = "obligations, duties, responsibilities of each party"
    context = retrieve_context(query, k=15)
    local_prompt = (
        f"Analyze the agreement excerpts and extract compliance obligations. "
        f"Strictly return a JSON array with objects containing 'party' and 'obligations'. Example:\n"
        f'[{{"party": "Tally", "obligations": ["obligation 1", "obligation 2"]}}]\n\n'
        f"1. Output ONLY valid JSON array\n"
        f"2. Max 2 obligations per party\n"
        f"3. Use exact party names from context\n"
        f"4. Remove section numbers\n"
        f"5. Exclude definitions\n\n"
        f"Excerpts: {context}"
    )
    response = llm.invoke(local_prompt)
    return response.strip()


@tool
def key_events() -> str:
    """Extracts key dates and events from the agreement in JSON format."""
    query = "effective date, termination date, deadline, renewal, notice period, timeline, YYYY-MM-DD"
    context = retrieve_context(query, k=30)
    local_prompt = (
        f"Extract key dates/events with these rules:\n"
        f"1. Only include dates in YYYY-MM-DD format\n"
        f"2. Exclude relative time periods like 'within X days'\n"
        f"3. Output format: [{{'date': 'YYYY-MM-DD', 'event': 'description'}}]\n"
        f"4. If no valid dates, return empty list\n\n"
        f"Excerpts: {context}"
    )
    response = llm.invoke(local_prompt)
    return response.strip()


@tool
def summarize_agreement() -> str:
    """Provides a concise summary of the agreement."""
    query = "summary of the agreement"
    context = retrieve_context(query, k=20)
    local_prompt = (
        f"You are an expert in summarizing legal agreements. Provide a concise and accurate summary of the following "
        f"excerpts in 2-3 sentences. Focus on the main purpose, key parties, and primary obligations or terms. "
        f"Avoid including unnecessary details or speculation beyond the given context.\n\n"
        f"Excerpts: {context}"
    )
    response = llm.invoke(local_prompt)
    return response.strip()


@tool
def guardrail(query: str) -> str:
    """Guardrail: If a user query is unrelated to legal agreements, return a fixed message.

    This tool ignores the query content and reminds the user that the chatbot is specifically designed
    for analyzing legal agreements.
    """
    return ("Our chatbot is specifically designed for analyzing legal agreements and answering queries "
            "related to agreement terms, compliance, and key events. Please ask a question related to legal agreements.")


tools = [agreement_qa, compliance_obligations_list,
         key_events, summarize_agreement, guardrail]


# ------------------ Agent Setup ------------------
system_prompt = """Respond to the human as helpfully and accurately as possible. You have access to the following tools: {tools}

**IMPORTANT:** If the user's question is not related to legal agreements, compliance obligations, key events, or summarizing agreements, you must ignore the query content and use the guardrail tool exclusively. The guardrail tool returns the following fixed message:
"Our chatbot is specifically designed for analyzing legal agreements and answering queries related to agreement terms, compliance, and key events. Please ask a question related to legal agreements."

Use a json blob to specify a tool by providing an action key (tool name) and an action_input key (tool input). For tools that do not require input, use an empty object ({{}}) as action_input.

Valid "action" values: "Final Answer" or {tool_names}

Provide only ONE action per 
JSON_BLOB

```

Observation: action result

... (repeat Thought/Action/Observation N times)

Thought: I know what to respond

Action:

```

{{

"action": "Final Answer",

"action_input": "Some text"

}}

Begin! Reminder to ALWAYS respond with a valid json blob of a single action.

Respond directly if appropriate. Format is Action:```$JSON_BLOB```then Observation"""
human_prompt = """{input}

{agent_scratchpad}

(reminder to always respond in a JSON blob)
"""


prompt_chat = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt),
        MessagesPlaceholder("chat_history", optional=True),
        ("human", human_prompt),
    ]
)

prompt_chat = prompt_chat.partial(
    tools=render_text_description_and_args(list(tools)),
    tool_names=", ".join([t.name for t in tools]),
)

memory = ConversationBufferMemory()

chain = (
    RunnablePassthrough.assign(
        agent_scratchpad=lambda x: format_log_to_str(x["intermediate_steps"]),
        chat_history=lambda x: memory.chat_memory.messages,
    )
    | prompt_chat
    | llm
    | JSONAgentOutputParser()
)

agent_executor = AgentExecutor(
    agent=chain,
    tools=tools,
    handle_parsing_errors=True,
    verbose=True,
    memory=memory
)

# ------------------ Flask Routes ------------------


@app.route("/upload_pdf", methods=["POST"])
def upload_pdf():
    """
    Accepts one or multiple PDF files via multipart/form-data.
    Saves them to ./uploaded_pdfs, then loads/embeds them into
    the existing Chroma vectorstore.
    """
    global pdfs_loaded

    if "file" not in request.files:
        return jsonify({"error": "No file part in request."}), 400

    files = request.files.getlist("file")
    if not files:
        return jsonify({"error": "No files provided."}), 400

    saved_paths = []
    for file in files:
        if file.filename == "":
            continue
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)
        saved_paths.append(file_path)

    if not saved_paths:
        return jsonify({"error": "No valid files uploaded."}), 400

    # Load & embed
    try:
        _load_and_add_pdfs(saved_paths)
        pdfs_loaded = True  # Mark that we have at least one doc
        return jsonify({"message": f"Successfully uploaded and embedded {len(saved_paths)} file(s)."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/chatbot", methods=["POST"])
def chatbot():
    """
    1) Chatbot with just interacting with agent_executor based on input query.
    Expects JSON: { "query": "some question" }
    """
    global pdfs_loaded
    if not pdfs_loaded:
        return jsonify({"error": "No PDFs have been uploaded yet. Please upload first."}), 400

    data = request.json or {}
    user_query = data.get("query", "")
    if not user_query:
        return jsonify({"error": "No 'query' field provided."}), 400

    try:
        response = agent_executor.invoke({"input": user_query})
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/summarizer", methods=["POST"])
def summarizer():
    """
    Summarizer: Provides a 2-3 sentence summary of the agreement.
    """
    global pdfs_loaded, full_text
    if not pdfs_loaded:
        return jsonify({"error": "No PDFs have been uploaded yet. Please upload first."}), 400

    # Build a prompt similar to other routes.
    prompt_text = f"""
You are an expert in summarizing legal agreements. Provide a concise summary of the agreement in exactly 2-3 plain sentences. Do not use bullet points, numbers, or lists. Focus on the main purpose, the key parties involved, and the primary obligations or terms.

Agreement Excerpts:
{full_text}
"""
    try:
        # Generate summary using the LLM
        summary_response = llm.generate([prompt_text])
        summary_text = summary_response.generations[0][0].text.strip()
        return jsonify({"summary": summary_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/key-events", methods=["POST"])
def key_events_route():
    """
    3) Returns key events in the agreement in JSON format,
       but uses the *entire* PDF text (full_text) instead of retrieval.
    """
    global pdfs_loaded, full_text
    if not pdfs_loaded:
        return jsonify({"error": "No PDFs have been uploaded yet. Please upload first."}), 400

    # Build the prompt from the entire full_text with strict JSON instructions.
    key_events_prompt = f"""
Given the following text extracted from a legal document, identify key events with their dates and descriptions.
Return the result as a JSON list of objects, where each object has a "date" (in YYYY-MM-DD format) and an "event" (a descriptive string).
Focus only on dates explicitly mentioned and significant actions such as signatures or agreement terms.
IMPORTANT: Output only valid JSON and nothing else. Do not include any extra commentary or text.

Text:
{full_text}

Output format:
[
    {{"date": "YYYY-MM-DD", "event": "description"}},
    ...
]
"""

    try:
        key_events_response = llm.generate(
            [key_events_prompt])  # Returns LLMResult
        key_events_text = key_events_response.generations[0][0].text

        key_events_json = json.loads(key_events_text)
        return jsonify(key_events_json)
    except json.JSONDecodeError:
        return jsonify({
            "error": "Could not parse JSON from response",
            "raw_response": key_events_text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/compliance-obligations-list", methods=["POST"])
def compliance_obligations_list_route():
    """
    4) Extract compliance obligations for each party in JSON format,
       again using *entire* PDF text (full_text).
    """
    global pdfs_loaded, full_text
    if not pdfs_loaded:
        return jsonify({"error": "No PDFs have been uploaded yet. Please upload first."}), 400

    compliance_prompt = f"""
Given the following text extracted from a legal document, identify the parties involved and their specific obligations.
Return the result as a JSON list of objects, where each object has a "party" (the name of the entity) and "obligations" (a list of obligation strings).
Follow these rules:
- For each named party, include a maximum of 2 specific obligations.
- If there are obligations that apply to both parties, include an entry with "party": "Both" and list up to 2 obligations that both parties must fulfill.
- Focus on explicit obligations or responsibilities assigned to parties in the text.
IMPORTANT: Output only valid JSON with no extra text or commentary.

Text:
{retrieve_context("obligations, duties, responsibilities", k=10)}

Output format:
[
    {{"party": "Party Name", "obligations": ["obligation 1", "obligation 2"]}},
    {{"party": "Both", "obligations": ["shared obligation 1", "shared obligation 2"]}},
    ...
]
"""

    try:
        compliance_response = llm.generate([compliance_prompt])
        compliance_text = compliance_response.generations[0][0].text
        print(compliance_response)

        compliance_json = json.loads(compliance_text)
        return jsonify(compliance_json)
    except json.JSONDecodeError:
        return jsonify({
            "error": "Could not parse JSON from response",
            "raw_response": compliance_text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/compliance-score", methods=["POST"])
def compliance_score_route():
    """
    5) Returns a custom compliance score (1-100) from the *entire* PDF text.
    """
    global pdfs_loaded, full_text
    if not pdfs_loaded:
        return jsonify({"error": "No PDFs have been uploaded yet. Please upload first."}), 400

    compliance_score_prompt = f"""
Given the following text extracted from a legal document, calculate the Compliance Obligatory Score,
a custom metric to gauge the number of obligations in the agreement and their importance in keeping
the agreement compliant and in force, on a scale from 1 to 100. Return ONLY a JSON object with a "score" field.
No additional text, explanations, or comments.

Text:
{full_text}

Output format:
{{
    "score": <integer between 1 and 100>
}}
"""
    try:
        compliance_score_response = llm.generate([compliance_score_prompt])
        compliance_score_text = compliance_score_response.generations[0][0].text

        compliance_score_json = json.loads(compliance_score_text)
        return jsonify(compliance_score_json)
    except json.JSONDecodeError:
        return jsonify({
            "error": "Could not parse JSON from response",
            "raw_response": compliance_score_text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return "Hello, world!"


# ------------------ Main ------------------
if __name__ == "__main__":
    # Print a custom message in the console
    print("Starting Flask server at http://127.0.0.1:5000 ...")

    # Now run Flask (blocking call)
    app.run(debug=True, host="0.0.0.0", port=3333)
