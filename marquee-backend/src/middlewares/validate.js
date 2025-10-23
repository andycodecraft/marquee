exports.validate = (schema) => async (req, _res, next) => {
  try {
    const value = await schema.validateAsync(req.body, { abortEarly: false });
    req.validatedBody = value;
    next();
  } catch (err) {
    err.isJoi = true;
    next(err);
  }
};
