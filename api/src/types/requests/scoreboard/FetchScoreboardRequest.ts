import { schema, Joi } from 'express-validation';

export const FetchScoreboardRequest: schema = {
  query: Joi.object({
    date: Joi.string()
      .optional()
      .regex(/\d{4}-\d{2}-\d{2}/),
  }),
};

export interface FetchScoreboardRequest {
  query: {
    date?: string;
  };
}
