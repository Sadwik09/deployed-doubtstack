import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Authentication validation
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'faculty', 'admin']).withMessage('Invalid role'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  validate
];

export const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Doubt validation
export const createDoubtValidation = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  // Tags validation removed - handled in controller to support FormData format
  validate
];

export const updateDoubtValidation = [
  param('id').isMongoId().withMessage('Invalid doubt ID'),
  body('title').optional().trim().isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description').optional().trim().isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
  validate
];

// Answer validation
export const createAnswerValidation = [
  param('doubtId').isMongoId().withMessage('Invalid doubt ID'),
  body('content').trim().notEmpty().withMessage('Answer content is required')
    .isLength({ max: 5000 }).withMessage('Answer cannot exceed 5000 characters'),
  validate
];

export const voteValidation = [
  param('id').isMongoId().withMessage('Invalid ID'),
  body('voteType').isIn(['upvote', 'downvote']).withMessage('Vote type must be upvote or downvote'),
  validate
];
