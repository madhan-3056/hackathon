const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Analyze legal document content
exports.analyzeDocument = async (content) => {
  try {
    const prompt = `
      Analyze the following legal document and provide:
      1. A risk score from 1-10 (10 being highest risk)
      2. List of potential legal issues
      3. Suggestions for improvement

      Document Content:
      ${content}

      Respond in JSON format with the following structure:
      {
        "riskScore": number,
        "issues": string[],
        "suggestions": string[]
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error('Failed to analyze document with AI');
  }
};

// Explain legal term in simple language
exports.explainLegalTerm = async (term) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Explain the legal term "${term}" in simple, non-technical language suitable for small business owners. Keep it under 100 words.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI explanation error:', error);
    throw new Error('Failed to explain legal term');
  }
};