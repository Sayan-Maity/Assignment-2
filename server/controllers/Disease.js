// Google Gemini :
// const axios = require("axios");
// const MODEL_NAME = "google/gemini-pro";
// const JWT_TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMTA0Njg4NjQ0MDg3MjU3OTU2NzU3In0sImlhdCI6MTcwNzE0NDg0MywiZXhwIjoxNzA4MjI0ODQzfQ.6HK2a2-osZMQeYomWR1lGyqeIlSZQVkHQCXJeHGXFD0";

// module.exports.disease = async (req, res) => {
//   const { disease } = req.body;
//   try {
//     const requestData = {
//       messages: [
//         {
//           role: "system",
//           content:
//             `Imagine you are the best Dermatological Doctor of the whole world, who has cured and knows every single known or discovered diseases related to skin, its symptoms, causes, communicable or not, treatment and any specific external link from where users would be able to get more information and always return the information in proper JSON format.`,
//         },
//         {
//           role: "user",
//           content: `I am suffering from ${disease} for a long time and now I want to know about this ${disease} in proper detail, please let me know`,
//         },
//       ],
//       model: {
//         name: "google/gemini-pro",
//       },
//       variables: [
//         {
//           name: "disease",
//           value: disease,
//         },
//       ],
//     };

//     const axiosConfig = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: "https://api.getknit.ai/v1/router/run",
//       headers: {
//         "x-auth-token": JWT_TOKEN,
//         "Content-Type": "application/json",
//       },
//       data: JSON.stringify(requestData),
//     };

//     const response = await axios.request(axiosConfig);
//     console.log(response.data);
//     return res.status(200).json(response.data);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// };

// OpenAI GPT-4 :
const axios = require('axios');
const MODEL_NAME = "openai/gpt-4";
const JWT_TOKEN = process.env.JWT_TOKEN;

module.exports.disease = async (req, res) => {
  const { disease } = req.body;

  try {
    const requestData = {
      messages: [
        {
          role: "system",
          content: `Imagine you are the best Dermatological Doctor of the whole world, who has cured and knows every single known or discovered disease related to skin, its symptoms, causes, communicable or not, treatment, and any specific external link from where users would be able to get more information, and always return the information in proper JSON format with field name including (disease, symptoms, causes, communicable, treatment, external_link).`,
        },
        {
          role: "user",
          content: `I am suffering from ${disease} for a long time and now I want to know about this ${disease} in proper detail (if you get 2 disease name, take the first one). Please let me know.`,
        },
      ],
      model: {
        name: MODEL_NAME,
      },
      variables: [
        {
          name: "disease",
          value: disease,
        },
      ],
    };

    const axiosConfig = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.getknit.ai/v1/router/run",
      headers: {
        "x-auth-token": JWT_TOKEN,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(requestData),
    };

    const response = await axios.request(axiosConfig);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};
