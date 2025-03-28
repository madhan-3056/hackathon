const aiService = require('../services/aiService.cjs');
const ErrorResponse = require('../utils/errorResponse');

// Explain a legal term
exports.explainTerm = async (req, res, next) => {
    try {
        const { term } = req.body;

        if (!term) {
            return next(new ErrorResponse('Please provide a term to explain', 400));
        }

        const explanation = await aiService.explainLegalTerm(term);

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
exports.analyze = async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content) {
            return next(new ErrorResponse('Please provide document content to analyze', 400));
        }

        const analysis = await aiService.analyzeDocument(content);

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        next(error);
    }
};

// Answer a legal question
exports.answerQuestion = async (req, res, next) => {
    try {
        const { question } = req.body;

        if (!question) {
            return next(new ErrorResponse('Please provide a question to answer', 400));
        }

        const answer = await aiService.answerLegalQuestion(question);
        
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
exports.getConfig = async (req, res, next) => {
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

// Export all functions as a module
module.exports = {
    explainTerm: exports.explainTerm,
    analyze: exports.analyze,
    answerQuestion: exports.answerQuestion,
    getConfig: exports.getConfig
};