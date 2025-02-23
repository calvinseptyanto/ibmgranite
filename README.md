# ConTrack: AI-Powered Contract Intelligence
![Cover Page](https://github.com/user-attachments/assets/246a0b7e-933c-4be0-90aa-7718fd6c15be)

## Overview
ConTrack—derived from Contract + Track—is designed to transform contract confusion into clarity. Contracts are the backbone of business, yet they remain complex, time-consuming, and difficult to manage. ConTrack leverages AI to streamline contract analysis, helping professionals understand agreements faster and mitigate risks effectively. Powered by IBM Granite and an Agentic RAG system, ConTrack extracts key terms, assigns obligations, scores compliance risks, and tracks critical deadlines. Users can instantly query contracts, receive concise summaries, and automate key workflows. With AI-driven automation, ConTrack ensures contracts work for you—not against you.

## Features
- **AI-Powered Contract Analysis**: Extracts key terms, obligations, and clauses from contracts.
- **Compliance Obligatory Score (COS)**: Evaluates contract risk and compliance.
- **Obligation Tracking**: Tracks commitments for each party and generates reminders.
- **AI Query System**: Enables natural language queries to quickly retrieve contract insights.
- **Summarization & Insights**: Generates concise summaries and key takeaways.
- **Integration with Trello**: Automates task management based on contract obligations.
- **Event & Timeline Tracking**: Automatically tracks key contract milestones.

## Installation

### Front-End Setup
1. Navigate to the client directory:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```

### Back-End Setup
#### Creating the Virtual Environment
1. Navigate to the server directory:
   ```sh
   cd server
   ```
2. Create a virtual environment named `venv`:
   ```sh
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows:
     ```sh
     venv\Scripts\activate
     ```
   - MacOS/Linux:
     ```sh
     source venv/bin/activate
     ```
4. Install the required packages:
   ```sh
   pip install -r requirements.txt
   ```

### Generating an LLM API Key from Watson Cloud
1. Create a `.env` file in the `server` directory with the following content (fill in your keys and credentials):
   ```sh
   IBM_WATSONX_APIKEY="your-api-key"
   IBM_WATSONX_PROJECT_ID="your-project-id"
   IBM_WATSONX_URL="your-watson-url"
   ```

### Starting the Service
Run the backend service:
```sh
python app.py
```

## Tools & Technologies Used
### Programming Languages
- Python (Flask backend)
- JavaScript (React frontend)

### Databases
- ChromaDB

### AI Models
- IBM Granite-3.1-8B-Instruct
- Granite Embedding 107M Multilingual

## Architecture
![Architecture Diagram](https://github.com/user-attachments/assets/9a46dc38-a880-4420-9a68-558858d6ce22)

## 👥 Team
<table>
<tr>
<td align="center">
<a href="https://github.com/GabrielxKuek">
<img src="https://avatars.githubusercontent.com/u/139882011?v=4" width="100px;" alt="Gabriel, All-seeing"/><br>
<sub>
<b>Gabriel Kuek</b>
</sub>
</a>
</td>
<td align="center">
<a href="https://github.com/xR4F4ELx">
<img src="https://avatars.githubusercontent.com/u/101986187?v=4" width="100px;" alt="Rafael Profile Picture"/><br>
<sub>
<b>Rafael Macam</b>
</sub>
</a>
</td>
<td align="center">
<a href="https://github.com/calvinseptyanto">
<img src="https://avatars.githubusercontent.com/u/98633109?v=4" width="100px;" alt="Calvin Profile Picture"/><br>
<sub>
<b>Calvin Septyanto</b>
</sub>
</a>
</td>
</tr>
</table>

Made by Hawk Tuah Reborn
