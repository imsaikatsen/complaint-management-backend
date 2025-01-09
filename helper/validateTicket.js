const { body, validationResult } = require('express-validator');

exports.validateTicket = [
  body('subject').notEmpty().withMessage('Subject is required'),
  body('description').notEmpty().withMessage('Description is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
