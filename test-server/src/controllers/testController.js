module.exports.uploadPdf = (req, res, next) => {
  res.status(200).json({
    "message": "Successfully uploaded and embedded 2 files(s)."
  });
};

module.exports.chatbot = (req, res, next) => {
    const query = req.body.query;

    if (query == null || query == "") {
        return res.status(400).json({
            "message": "Please provide a query."
        });
    }

    res.status(200).json({
        "response": {
            "history": "",
            "input": `${query}`,
            "output": "Our chatbot is specifically designed for analyzing legal agreements and answering queries related to agreement terms, compliance, and key events. Please ask a question related to legal agreements."
        }
    });
}

module.exports.keyEvents = (req, res, next) => {
    res.status(200).send([
        {
            "date": "2021-01-01",
            "event": "Effective date of the Agreement"
        },
        {
            "date": "2021-02-15",
            "event": "Signature of the Agreement by Party A"
        },
        {
            "date": "2021-03-10",
            "event": "Signature of the Agreement by Party B"
        },
        {
            "date": "2021-04-01",
            "event": "Commencement of the Agreement terms"
        },
        {
            "date": "2021-05-15",
            "event": "First review of the Agreement performance"
        },
        {
            "date": "2021-06-30",
            "event": "End of the initial term of the Agreement"
        },
        {
            "date": "2021-07-15",
            "event": "Renewal of the Agreement for another term"
        }
    ])
}

module.exports.complianceScore = (req, res, next) => {
    res.status(200).json({
        "score": 75
    });
}

module.exports.summarizer = (req, res, next) => {
    res.status(200).json({
        "summary": "Summary:\nThis Non-Disclosure Agreement (NDA) is between Tally Services Inc (Discloser) and ByCo Ltd (Recipient) for the purpose of facilitating discussions regarding the development of Treasury Management Software. The Recipient agrees not to disclose any Proprietary Information received from the Discloser to third parties or use it for any purpose other than as outlined in the agreement. The Recipient must notify the Discloser of any legal action or government regulations requiring disclosure and cooperate in contesting such disclosure. After three years, the Recipient is relieved of all obligations under this agreement. Both parties acknowledge that no license under any patents, trademarks, copyrights, or mask works is granted. The agreement is governed by California law and either party can terminate it without cause upon written notice."
    });
}

module.exports.complianceObligationsList = (req, res, next) => {
    res.status(200).send([
        {
            "obligations": [
                "provide quarterly financial reports",
                "maintain accurate records"
            ],
            "party": "Company A"
        },
        {
            "obligations": [
                "provide semi-annual market analysis",
                "ensure data privacy"
            ],
            "party": "Company B"
        },
        {
            "obligations": [
                "comply with applicable laws",
                "maintain confidentiality"
            ],
            "party": "Both"
        }
    ])
}