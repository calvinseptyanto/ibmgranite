const API_BASE_URL = 'http://localhost:3333';

export const ConTrackAPI = {
  // Upload PDFs
  uploadFiles: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });

    const response = await fetch(`${API_BASE_URL}/upload_pdf`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Get Summary
  getSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/summarizer`, {
      method: 'POST',
    });
    return response.json();
  },

  // Get Key Events
  getKeyEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/key-events`, {
      method: 'POST',
    });
    return response.json();
  },

  // Get Compliance Score and Obligations
  getComplianceData: async () => {
    const [scoreResponse, obligationsResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/compliance-score`, {
        method: 'POST',
      }),
      fetch(`${API_BASE_URL}/compliance-obligations-list`, {
        method: 'POST',
      })
    ]);

    const score = await scoreResponse.json();
    const obligations = await obligationsResponse.json();

    return {
      score: score.score,
      obligations: obligations
    };
  },

  // Send Chat Message
  sendChatMessage: async (message) => {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: message }),
    });
    return response.json();
  }
};