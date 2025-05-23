import joi from "joi";

export const videoValidation = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  thumbnailUrl: joi.string().required(),
  videoUrl: joi.string().required(),
  claudinaryPublicId: joi.string().required(),
});

export default videoValidation;
