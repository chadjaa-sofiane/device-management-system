import clsx, { ClassValue } from "clsx";
import type { Path, UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const createSequentialArray = (start: number, end: number, step = 1) => {
  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, i) => start + step * i);
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
