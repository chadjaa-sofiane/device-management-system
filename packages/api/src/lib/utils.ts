import { z } from "zod";

export const zodStringToNumber = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => (val ? parseInt(val as string) : undefined), schema);
