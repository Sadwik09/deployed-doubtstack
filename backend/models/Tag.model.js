import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['subject', 'topic', 'technology', 'general'],
    default: 'general'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  relatedTags: [{
    type: String
  }]
}, {
  timestamps: true
});

tagSchema.index({ name: 1 });
tagSchema.index({ usageCount: -1 });

const Tag = mongoose.model('Tag', tagSchema);

export default Tag;
