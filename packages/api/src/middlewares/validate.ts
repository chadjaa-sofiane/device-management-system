import type { RequestHandler } from "express";
import type { AnyZodObject } from "zod";

/**
 * Middleware for validating request data against a Zod schema.
 *
 * @param {AnyZodObject} schema - The Zod schema to validate against.
 * @returns {RequestHandler} Express RequestHandler middleware.
 */

const validate =
  (schema: AnyZodObject): RequestHandler<unknown, unknown, unknown, unknown> =>
  async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

export default validate;
