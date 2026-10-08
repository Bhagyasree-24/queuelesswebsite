const Joi = require('joi');

const createServiceSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().optional().allow(''),
  averageServiceTime: Joi.number().integer().min(1).required()
});

const updateServiceSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().trim().optional().allow(''),
  averageServiceTime: Joi.number().integer().min(1).optional()
}).min(1);

module.exports = {
  createServiceSchema,
  updateServiceSchema
};