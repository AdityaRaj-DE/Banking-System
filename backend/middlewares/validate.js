import { errorResponse } from '../utils/response.js';

export const validate = (schema) => (req, res, next) => {
  const { body } = req;
  const errors = [];

  for (const [key, rules] of Object.entries(schema)) {
    const value = body[key];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`);
      continue;
    }

    if (value !== undefined) {
      if (rules.type === 'number' && typeof value !== 'number') {
        errors.push(`${key} must be a number`);
      }
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${key} must be at least ${rules.min}`);
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${key} is invalid`);
      }
    }
  }

  if (errors.length > 0) {
    return errorResponse(res, errors.join(', '), 400);
  }

  next();
};
