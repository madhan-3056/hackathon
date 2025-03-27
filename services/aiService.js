// Using built-in fetch API to make requests to Claude AI API
import axios from 'axios';

// Flag to track if Claude API is available
let isClaudeAvailable = false;

// Check if Claude API key is available
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

if (CLAUDE_API_KEY) {
  console.log('Claude API key found, AI features will be available');
  isClaudeAvailable = true;
} else {
  console.log('Claude API key not found, using mock data for AI features');
}

// Function to make a request to Claude API
const callClaudeAPI = async (prompt) => {
  try {
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (!CLAUDE_API_KEY) {
      throw new Error('Claude API key not found');
    }

    console.log('Making request to Claude API...');
    console.log('Using API key:', CLAUDE_API_KEY.substring(0, 10) + '...');

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    console.log('Response received from Claude API!');

    if (!response.data || !response.data.content || !response.data.content[0]) {
      console.error('Unexpected response format:', response.data);
      throw new Error('Unexpected response format from Claude API');
    }

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API error:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

// Mock data for document analysis
const getMockDocumentAnalysis = () => {
  return {
    riskScore: 5,
    issues: [
      'Ambiguous terms in section 3.2',
      'Missing liability clause',
      'Inadequate data protection provisions'
    ],
    suggestions: [
      'Clarify terms in section 3.2 with specific definitions',
      'Add comprehensive liability clause',
      'Enhance data protection provisions to comply with current regulations'
    ]
  };
};

// Analyze legal document content
export const analyzeDocument = async (content) => {
  try {
    // If Claude API is not available, return mock data
    if (!isClaudeAvailable) {
      console.log('Claude API not available, returning mock data');
      return getMockDocumentAnalysis();
    }

    console.log('Using Claude API for document analysis');
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

    const responseText = await callClaudeAPI(prompt);

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from Claude response');
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (error) {
    console.error('AI analysis error:', error);
    // Return mock data in case of error
    return getMockDocumentAnalysis();
  }
};

// Explain legal term in simple language
export const explainLegalTerm = async (term) => {
  try {
    // If Claude API is not available, return mock data
    if (!isClaudeAvailable) {
      console.log('Claude API not available, returning mock data');
      return `"${term}" is a legal concept that typically refers to [mock explanation]. In simple terms, it means [simplified explanation]. Small business owners should be aware that this can affect [business impact].`;
    }

    console.log('Using Claude API for legal term explanation');
    const prompt = `Explain the legal term "${term}" in simple, non-technical language suitable for small business owners. Keep it under 100 words.`;

    const response = await callClaudeAPI(prompt);
    return response;
  } catch (error) {
    console.error('AI explanation error:', error);
    return `Error explaining the term "${term}". Please try again later.`;
  }
};

// Create a default export for the service
const aiService = {
  analyzeDocument,
  explainLegalTerm
};

export default aiService;