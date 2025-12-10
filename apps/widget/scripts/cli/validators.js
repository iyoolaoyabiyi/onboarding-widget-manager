/**
 * Tour validation utilities
 */

export function validateTourData(tour) {
  const errors = [];

  if (!tour.id) {
    errors.push('Missing required field: id');
  }

  if (!tour.name) {
    errors.push('Missing required field: name');
  }

  if (!Array.isArray(tour.steps) || tour.steps.length === 0) {
    errors.push('Missing required field: steps (must be a non-empty array)');
  }

  if (Array.isArray(tour.steps) && tour.steps.length < 5) {
    errors.push(`Tour must have at least 5 steps (found ${tour.steps.length})`);
  }

  // Validate each step
  if (Array.isArray(tour.steps)) {
    tour.steps.forEach((step, index) => {
      if (!step.id) errors.push(`Step ${index + 1}: missing id`);
      if (!step.order) errors.push(`Step ${index + 1}: missing order`);
      if (!step.target_element) errors.push(`Step ${index + 1}: missing target_element`);
      if (!step.title) errors.push(`Step ${index + 1}: missing title`);
      if (!step.content) errors.push(`Step ${index + 1}: missing content`);
      if (!step.position) errors.push(`Step ${index + 1}: missing position`);
      if (!['top', 'bottom', 'left', 'right'].includes(step.position)) {
        errors.push(`Step ${index + 1}: invalid position "${step.position}"`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateUpdateData(data) {
  const errors = [];

  // When updating, these fields should not be changed
  if (data.id) {
    errors.push('Cannot update tour id');
  }

  if (data.created_at) {
    errors.push('Cannot update created_at timestamp');
  }

  if (Array.isArray(data.steps) && data.steps.length < 5) {
    errors.push(`Tour must have at least 5 steps (found ${data.steps.length})`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
