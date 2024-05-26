import clsx, { ClassValue } from "clsx";
import type { Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { type ZodIssue } from "zod";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const createSequentialArray = (start: number, end: number, step = 1) => {
  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, i) => start + step * i);
};

export const extractErrorsFromIssues = (issues: ZodIssue[] = []) => {
  return issues.reduce(
    (acc, issue) => {
      acc[issue.path[1]] = issue.message;
      return acc;
    },
    {} as Record<string, string>,
  );
};

type MongooseError = {
  name: string;
  message: string;
  code: number;
  keyPattern: Record<string, number>;
  keyValue: Record<string, string>;
  index: number;
};

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
