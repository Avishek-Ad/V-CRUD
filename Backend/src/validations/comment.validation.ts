import joi from "joi";

const commentValidation = joi.object({
    comment: joi.string().required(),
});

export default commentValidation;