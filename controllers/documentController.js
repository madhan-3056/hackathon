// Import using ES modules
import Document from '../models/Document.js';
import ErrorResponse from '../utils/errorResponse.js';
import { analyzeDocument as analyzeDocumentService } from '../services/aiService.js';

// @desc    Create a new document
// @route   POST /api/v1/documents
// @access  Private
export const createDocument = async (req, res, next) => {
  try {
    const { title, content, type } = req.body;
    const userId = req.user.id;

    const document = await Document.create({
      user: userId,
      title,
      content,
      type,
    });

    res.status(201).json({
      success: true,
      data: document,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Analyze document with AI
// @route   POST /api/v1/documents/:id/analyze
// @access  Private
export const analyzeDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return next(
        new ErrorResponse(`Document not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is document owner
    if (document.user.toString() !== req.user.id) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to analyze this document`,
          401
        )
      );
    }

    // Analyze document with AI
    const analysis = await analyzeDocumentService(document.content);

    // Update document with analysis results
    document.riskAssessment = {
      score: analysis.riskScore,
      issues: analysis.issues,
      suggestions: analysis.suggestions,
    };

    await document.save();

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (err) {
    next(err);
  }
};