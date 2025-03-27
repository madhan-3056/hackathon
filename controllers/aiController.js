import { analyzeDocument, explainLegalTerm, answerLegalQuestion } from '../services/aiService.js';
import ErrorResponse from '../utils/errorResponse.js';

// Explain a legal term
export const explainTerm = async (req, res, next) => {
    try {
        const { term } = req.body;

        if (!term) {
            return next(new ErrorResponse('Please provide a term to explain', 400));
        }

        const explanation = await explainLegalTerm(term);

        res.status(200).json({
            success: true,
            data: {
                term,
                explanation
            }
        });
    } catch (error) {
        next(error);
    }
};

// Analyze a document
export const analyze = async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content) {
            return next(new ErrorResponse('Please provide document content to analyze', 400));
        }

        const analysis = await analyzeDocument(content);

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        next(error);
    }
};

// Answer a legal question
export const answerQuestion = async (req, res, next) => {
    try {
        const { question } = req.body;

        if (!question) {
            return next(new ErrorResponse('Please provide a question to answer', 400));
        }

        const answer = await answerLegalQuestion(question);

        res.status(200).json({
            success: true,
            data: {
                question,
                answer
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get AI configuration
export const getConfig = async (req, res, next) => {
    try {
        // Only return minimal configuration info, not the actual API key
        res.status(200).json({
            success: true,
            data: {
                available: process.env.CLAUDE_API_KEY ? true : false,
                model: 'claude-3-haiku-20240307',
                capabilities: [
                    'Legal term explanations',
                    'Document analysis',
                    'Small business legal questions',
                    'Startup compliance guidance'
                ]
            }
        });
    } catch (error) {
        next(error);
    }
};

// Default export for compatibility
export default {
    explainTerm,
    analyze,
    answerQuestion,
    getConfig
};