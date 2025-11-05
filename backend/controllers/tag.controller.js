import Tag from '../models/Tag.model.js';

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
export const getTags = async (req, res) => {
  try {
    const { search, category, limit = 50 } = req.query;

    const query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (category) {
      query.category = category;
    }

    const tags = await Tag.find(query)
      .sort('-usageCount')
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      data: { tags }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get tag suggestions (autocomplete)
// @route   GET /api/tags/suggest
// @access  Public
export const suggestTags = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(200).json({
        status: 'success',
        data: { suggestions: [] }
      });
    }

    const suggestions = await Tag.find({
      name: { $regex: `^${query}`, $options: 'i' }
    })
      .select('name category usageCount')
      .sort('-usageCount')
      .limit(10);

    res.status(200).json({
      status: 'success',
      data: { suggestions }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Create tag
// @route   POST /api/tags
// @access  Private (Admin)
export const createTag = async (req, res) => {
  try {
    const { name, description, category, relatedTags } = req.body;

    const tag = await Tag.create({
      name: name.toLowerCase(),
      description,
      category,
      relatedTags
    });

    res.status(201).json({
      status: 'success',
      data: { tag }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
