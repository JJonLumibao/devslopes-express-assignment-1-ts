import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.flatMap((issue) => {
        if (issue.code === "unrecognized_keys") {
          return issue.keys.map(
            (key) => `'${key}' is not a valid key`
          );
        }

        return issue.message;
      });

      return res.status(400).json({ errors });
    }

    req.body = result.data;

    next();
  };