import clsx, { ClassValue } from "clsx";
import type { Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { ZodError, type ZodIssue } from "zod";

/**
 * Combines class names using Tailwind CSS's twMerge and clsx utility functions.
 * This function is designed to simplify the process of combining class names in React components.
 *
 */

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Generates an array of sequential numbers starting from `start` and ending at `end` with a step of `step`.
 *
 */

export const createSequentialArray = (start: number, end: number, step = 1) => {
  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, i) => start + step * i);
};

/**
 * Checks if an error is a Zod validation error.
 *
 */
export const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError;
};

/**
 * Extracts errors from an array of Zod validation issues and returns them as a key-value pair.
 *
 */

export const extractErrorsFromIssues = (issues: ZodIssue[] = []) => {
  return issues.reduce(
    (acc, issue) => {
      acc[issue.path[1]] = issue.message;
      return acc;
    },
    {} as Record<string, string>,
  );
};

export type MongooseError = {
  name: string;
  message: string;
  code: number;
  keyPattern: Record<string, number>;
  keyValue: Record<string, string>;
  index: number;
};

/**
 * Extracts meaningful error messages from Mongoose error objects.
 * This function is specifically designed to handle errors commonly encountered when interacting with MongoDB using Mongoose.
 * note: currently it is only handeling errors with error code of 11000 (unique element).
 *
 */

export const extractMongooseErrors = (error: MongooseError | null) => {
  if (!error) return {};
  if (error?.code === 11000) {
    const keys = Object.keys(error.keyPattern);
    return {
      [keys[0]]: `${keys[0]} already exists !`,
    };
  }
  return {};
};

/**
 * Type guard to check if an error is a MongooseError.
 */
export const isMongooseError = (error: unknown): error is MongooseError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "message" in error &&
    "code" in error &&
    "keyPattern" in error &&
    "keyValue" in error &&
    "index" in error
  );
};

/**
 * Maps server-side validation errors to form errors for React Hook Form.
 * This function is designed to be used in conjunction with useForm from react-hook-form.
 *
 */

export const mapServerErrorsToForm = <
  T extends Record<string, string | undefined | null>,
>(
  setError: UseFormSetError<Required<T>>,
  errors: T,
): void => {
  if (!errors) return;
  for (const [key, value] of Object.entries(errors)) {
    if (!value) return;
    setError(key as unknown as Path<Required<T>>, {
      type: "manual",
      message: value,
    });
  }
};
