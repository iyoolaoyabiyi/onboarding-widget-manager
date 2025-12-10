/**
 * Tour validation utilities
 */

const VALID_THEMES = ['greyscale', 'blue', 'green', 'red'];
const VALID_STATUSES = ['draft', 'active', 'paused', 'archived'];
const VALID_POSITIONS = ['top', 'bottom', 'left', 'right', 'center'];

export function validateTourData(tour) {
  const errors = [];

  // Required fields
  if (!tour.id) {
    errors.push('Missing required field: id');
  }

  if (!tour.name) {
    errors.push('Missing required field: name');
  }

  if (!tour.owner_id) {
    errors.push('Missing required field: owner_id');
  }

  // Theme validation
  if (!tour.theme) {
    errors.push('Missing required field: theme');
  } else if (!VALID_THEMES.includes(tour.theme)) {
    errors.push(`Invalid theme: ${tour.theme}. Must be one of: ${VALID_THEMES.join(', ')}`);
  }

  // Status validation
  if (!tour.status) {
    errors.push('Missing required field: status');
  } else if (!VALID_STATUSES.includes(tour.status)) {
    errors.push(`Invalid status: ${tour.status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Domain validation
  if (!Array.isArray(tour.allowed_domains) || tour.allowed_domains.length === 0) {
    errors.push('Missing required field: allowed_domains (must be a non-empty array)');
  }

  // Steps validation
  if (!Array.isArray(tour.steps) || tour.steps.length === 0) {
    errors.push('Missing required field: steps (must be a non-empty array)');
  }

  const minSteps = tour.min_steps || 5;
  if (Array.isArray(tour.steps) && tour.steps.length < minSteps) {
    errors.push(`Tour must have at least ${minSteps} steps (found ${tour.steps.length})`);
  }

  // Validate each step
  if (Array.isArray(tour.steps)) {
    tour.steps.forEach((step, index) => {
      if (!step.id) errors.push(`Step ${index + 1}: missing id`);
      if (typeof step.order !== 'number') errors.push(`Step ${index + 1}: missing or invalid order`);
      if (!step.target_element) errors.push(`Step ${index + 1}: missing target_element`);
      if (!step.title) errors.push(`Step ${index + 1}: missing title`);
      if (!step.content) errors.push(`Step ${index + 1}: missing content`);
      if (!step.position) errors.push(`Step ${index + 1}: missing position`);
      if (!VALID_POSITIONS.includes(step.position)) {
        errors.push(`Step ${index + 1}: invalid position "${step.position}". Must be one of: ${VALID_POSITIONS.join(', ')}`);
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

  if (data.owner_id) {
    errors.push('Cannot update owner_id');
  }

  // Validate theme if provided
  if (data.theme && !VALID_THEMES.includes(data.theme)) {
    errors.push(`Invalid theme: ${data.theme}. Must be one of: ${VALID_THEMES.join(', ')}`);
  }

  // Validate status if provided
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    errors.push(`Invalid status: ${data.status}. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  // Validate domains if provided
  if (data.allowed_domains !== undefined) {
    if (!Array.isArray(data.allowed_domains) || data.allowed_domains.length === 0) {
      errors.push('allowed_domains must be a non-empty array');
    }
  }

  // Validate steps if provided
  if (Array.isArray(data.steps)) {
    const minSteps = data.min_steps || 5;
    if (data.steps.length < minSteps) {
      errors.push(`Tour must have at least ${minSteps} steps (found ${data.steps.length})`);
    }

    // Validate each step structure
    data.steps.forEach((step, index) => {
      if (!step.id) errors.push(`Step ${index + 1}: missing id`);
      if (typeof step.order !== 'number') errors.push(`Step ${index + 1}: missing or invalid order`);
      if (!step.target_element) errors.push(`Step ${index + 1}: missing target_element`);
      if (!step.title) errors.push(`Step ${index + 1}: missing title`);
      if (!step.content) errors.push(`Step ${index + 1}: missing content`);
      if (!step.position) errors.push(`Step ${index + 1}: missing position`);
      if (!VALID_POSITIONS.includes(step.position)) {
        errors.push(`Step ${index + 1}: invalid position "${step.position}". Must be one of: ${VALID_POSITIONS.join(', ')}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
