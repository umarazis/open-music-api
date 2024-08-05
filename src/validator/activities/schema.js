const Joi = require('joi');

const ActivitiesPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  songId: Joi.string().required(),
  userId: Joi.string().required(),
  action: Joi.string().required(),
  time: Joi.string().required(),
});

module.exports = { ActivitiesPayloadSchema };
