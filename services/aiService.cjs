// Using built-in fetch API to make requests to Claude AI API
const axios = require('axios');

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
const callClaudeAPI = async (prompt, systemPrompt = null) => {
    try {
        const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;

        if (!CLAUDE_API_KEY) {
            throw new Error('Claude API key not found');
        }

        console.log('Making request to Claude API...');
        console.log('Using API key:', CLAUDE_API_KEY.substring(0, 10) + '...');

        // Default system prompt for legal assistant
        const defaultSystemPrompt = `You are El ClassicoAI, a specialized legal assistant for small businesses and startups.
Your primary goal is to provide clear, accurate, and practical legal information tailored to the needs of entrepreneurs and small business owners.

When responding to questions:
1. Focus on practical advice that small businesses and startups can implement
2. Explain legal concepts in plain, accessible language without unnecessary jargon
3. When relevant, mention how legal requirements might differ for businesses of different sizes
4. Provide context about why certain legal requirements exist
5. If appropriate, mention common pitfalls or misconceptions
6. Always clarify when something might require consultation with a licensed attorney
7. Be concise but thorough in your explanations

Areas of expertise include:
- Business formation (LLC, S-Corp, C-Corp, partnerships)
- Intellectual property protection
- Employment law for small businesses
- Contract drafting and review considerations
- Regulatory compliance for startups
- Privacy laws and data protection
- Funding and investment legal considerations
- Tax implications of business decisions

Remember that you are providing general legal information, not specific legal advice for individual situations.`;

        // Prepare messages array
        const messages = [];

        // Add system prompt if provided, otherwise use default
        if (systemPrompt || defaultSystemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt || defaultSystemPrompt
            });
        }

        // Add user prompt
        messages.push({
            role: 'user',
            content: prompt
        });

        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-haiku-20240307',
                max_tokens: 1000,
                temperature: 0.3,
                messages: messages
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
            'Ambiguous terms in section 3.2 that could disadvantage a small business',
            'Missing liability clause that could expose your startup to significant risk',
            'Inadequate data protection provisions that may not comply with regulations for your industry'
        ],
        suggestions: [
            'Clarify terms in section 3.2 with specific definitions tailored to your business operations',
            'Add comprehensive liability clause with caps appropriate for your business size',
            'Enhance data protection provisions to comply with current regulations for your specific industry'
        ],
        keyTerms: [
            'Payment terms (section 2.1) - consider negotiating more favorable timing',
            'Intellectual property rights (section 4) - ensure your business retains rights to its core assets',
            'Termination clause (section 7) - review notice periods and ensure they work for your business cycle'
        ],
        consultAttorney: [
            'Review the indemnification provisions in section 5',
            'Assess compliance requirements specific to your industry',
            'Evaluate the dispute resolution mechanism in section 8'
        ]
    };
};

// Analyze legal document content
exports.analyzeDocument = async (content) => {
    try {
        // If Claude API is not available, return mock data
        if (!isClaudeAvailable) {
            console.log('Claude API not available, returning mock data');
            return getMockDocumentAnalysis();
        }

        console.log('Using Claude API for document analysis');
        const systemPrompt = `You are El ClassicoAI, a specialized legal assistant for small businesses and startups.
Your task is to analyze legal documents from the perspective of a small business or startup.
Focus on practical implications, risks, and considerations that would be most relevant to entrepreneurs and small business owners.
Provide analysis that is thorough but accessible to non-lawyers.`;

        const prompt = `
      Analyze the following legal document from a small business perspective and provide:
      1. A risk score from 1-10 (10 being highest risk)
      2. List of potential legal issues specifically relevant to small businesses
      3. Practical suggestions for improvement
      4. Key terms that might need clarification or negotiation
      5. Areas where consulting with an attorney would be particularly important

      Document Content:
      ${content}

      Respond in JSON format with the following structure:
      {
        "riskScore": number,
        "issues": string[],
        "suggestions": string[],
        "keyTerms": string[],
        "consultAttorney": string[]
      }
    `;

        const responseText = await callClaudeAPI(prompt, systemPrompt);

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
exports.explainLegalTerm = async (term) => {
    try {
        // If Claude API is not available, return mock data
        if (!isClaudeAvailable) {
            console.log('Claude API not available, returning mock data');
            return `"${term}" is a legal concept that typically refers to [mock explanation]. In simple terms, it means [simplified explanation]. Small business owners should be aware that this can affect [business impact].`;
        }

        console.log('Using Claude API for legal term explanation');
        const systemPrompt = `You are El ClassicoAI, a specialized legal assistant for small businesses and startups.
Your task is to explain legal terms in a way that's accessible and relevant to small business owners and entrepreneurs.
For each term:
1. Provide a clear, jargon-free definition
2. Explain why this term matters specifically for small businesses or startups
3. Include practical implications or considerations
4. If relevant, mention when professional legal advice might be needed
Keep your explanation concise (under 150 words) but comprehensive.`;

        const prompt = `Explain the legal term "${term}" for a small business owner or startup founder.`;

        const response = await callClaudeAPI(prompt, systemPrompt);
        return response;
    } catch (error) {
        console.error('AI explanation error:', error);
        return `Error explaining the term "${term}". Please try again later.`;
    }
};

// Answer general legal questions for small businesses
exports.answerLegalQuestion = async (question) => {
    try {
        // If Claude API is not available, return a generic response
        if (!isClaudeAvailable) {
            console.log('Claude API not available, returning generic response');
            return `I understand you're asking about "${question}". As a virtual legal assistant, I can provide general information, but for specific advice tailored to your business situation, I recommend consulting with a qualified attorney.`;
        }

        console.log('Using Claude API for legal question answering');
        const systemPrompt = `You are El ClassicoAI, a specialized legal assistant for small businesses and startups.
Your primary goal is to provide clear, accurate, and practical legal information tailored to the needs of entrepreneurs and small business owners.

When responding to questions:
1. Focus on practical advice that small businesses and startups can implement
2. Explain legal concepts in plain, accessible language without unnecessary jargon
3. When relevant, mention how legal requirements might differ for businesses of different sizes
4. Provide context about why certain legal requirements exist
5. If appropriate, mention common pitfalls or misconceptions
6. Always clarify when something might require consultation with a licensed attorney
7. Be concise but thorough in your explanations

Areas of expertise include:
- Business formation (LLC, S-Corp, C-Corp, partnerships)
- Intellectual property protection
- Employment law for small businesses
- Contract drafting and review considerations
- Regulatory compliance for startups
- Privacy laws and data protection
- Funding and investment legal considerations
- Tax implications of business decisions

Remember that you are providing general legal information, not specific legal advice for individual situations.`;

        const response = await callClaudeAPI(question, systemPrompt);
        return response;
    } catch (error) {
        console.error('AI question answering error:', error);
        return `I apologize, but I'm having trouble processing your question about "${question}" right now. Please try again later or rephrase your question.`;
    }
};