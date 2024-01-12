const axios = require("axios");

class httpservice {
  static async get(service, token) {
    
    const response = await axios.get(service, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;

  }
}

module.exports = httpservice;