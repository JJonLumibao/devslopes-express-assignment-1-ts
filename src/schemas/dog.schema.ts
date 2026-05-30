import { z } from "zod";

export const createDogSchema = z
  .object({
    name: z.string({
      error:"name should be a string",
    }),
    description: z.string({
      error:"description should be a string",
    }),
    breed: z.string().optional(),
    age: z.number({
      error:"age should be a number",
    }),
  })
  .strict();

export const updateDogSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    breed: z.string().optional(),
    age: z.number().optional(),
  })
  .strict();