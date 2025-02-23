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

  // In ConTrackAPI.js
  getComplianceData: async () => {
    try {
      // Only fetch obligations since that's what we're using
      const obligationsResponse = await fetch(`${API_BASE_URL}/compliance-obligations-list`, {
        method: 'POST',
      });
      
      const obligationsData = await obligationsResponse.json();
      
      // Check if we got an error response
      if (obligationsData.error) {
        throw new Error(obligationsData.error);
      }

      // If raw_response exists, try to parse it (it seems to contain JSON string)
      if (obligationsData.raw_response) {
        // Find the JSON array in the raw response
        const match = obligationsData.raw_response.match(/\[.*\]/s);
        if (match) {
          try {
            return {
              obligations: JSON.parse(match[0])
            };
          } catch (e) {
            console.error('Failed to parse raw response:', e);
          }
        }
      }

      // If we get here, return empty obligations
      return {
        obligations: []
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        obligations: []
      };
    }
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