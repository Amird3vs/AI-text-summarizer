async function summarizeText(text) {
  const axios = require("axios");

  const token = "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";

  let data = JSON.stringify({
    inputs: text,
    parameters: {
      max_length: 100,
      min_length: 30,
    },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
    headers: {
      "Content-Type": "application/json",
      'Authorization': 'Bearer ' + token
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return response.data[0].summary_text;
  } catch (error) {
    console.log(error);
  }
}

module.exports = summarizeText;
