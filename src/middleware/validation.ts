import withJoi from 'next-joi';
import * as originalJoi from 'joi';

export const Joi = originalJoi.extend((joi) => ({
  base: joi.array(),
  type: 'stringArray',
  coerce: (value) => (value.split ? value.split(',') : value),
}));

export default withJoi({
  onValidationError: (req, res, error): void => {
    res.status(400).json({ error: error?.details?.[0]?.message || '' });
  },
});
