import { unlinkSync } from "fs";
import { z } from "zod";

export const zodStringToNumber = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => (val ? parseInt(val as string) : undefined), schema);

export const deleteFile = (path: string) => {
  try {
    unlinkSync(path);
  } catch (error) {
    console.log(error);
  }
};
