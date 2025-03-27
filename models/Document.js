const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a document title'],
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['contract', 'agreement', 'policy', 'other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'reviewed', 'signed', 'archived'],
    default: 'draft',
  },
  riskAssessment: {
    score: Number,
    issues: [String],
    suggestions: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

documentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Document', documentSchema);