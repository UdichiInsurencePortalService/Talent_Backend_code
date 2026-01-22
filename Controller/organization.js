// controllers/organization.controller.js

const { organizationmodel } = require('../Model/organizationmodel');

// Very simple validation: returns array of error messages (empty = OK)
function validatePayload(payload) {
  const errors = [];

  // required: firstName (non-empty string)
  if (!payload.firstName || payload.firstName.toString().trim() === '') {
    errors.push('firstName is required');
  }

  // required: email must contain '@'
  if (!payload.email || payload.email.toString().indexOf('@') === -1) {
    errors.push('a valid email is required');
  }

  // optional numeric fields: if provided, must be numeric
//   if (payload.companySize !== undefined && payload.companySize !== '') {
//     if (isNaN(Number(payload.companySize))) {
//       errors.push('companySize must be a number');
//     }
//   }
  if (payload.numberOfHiring !== undefined && payload.numberOfHiring !== '') {
    if (isNaN(Number(payload.numberOfHiring))) {
      errors.push('numberOfHiring must be a number');
    }
  }

  return errors;
}

// Handler for POST /api/organizations
async function organizationmodelHandler(req, res) {
  try {
    const payload = req.body; // read JSON body sent by client

    // 1) Validate input
    const errors = validatePayload(payload);
    if (errors.length > 0) {
      // 400 Bad Request when validation fails
      return res.status(400).json({ success: false, errors });
    }

    // 2) Normalize numeric fields before saving
    const toSave = {
      ...payload, // copy all fields from payload
      companySize:
        payload.companySize === '' || payload.companySize === undefined
          ? null
          : Number(payload.companySize),
      numberOfHiring:
        payload.numberOfHiring === '' || payload.numberOfHiring === undefined
          ? null
          : Number(payload.numberOfHiring)
    };

    // 3) Call model to insert record into DB
    const created = await organizationmodel(toSave);

    // 4) Return created resource with 201 status
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error('organizationmodel error:', err);

    // handle unique constraint (duplicate email) from Postgres
    if (err && err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Generic server error
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { organizationmodelHandler };
