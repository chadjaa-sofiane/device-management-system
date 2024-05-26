import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef, forwardRef, useId } from "react";

type Status = "error" | "done" | "normal";

interface SelectProps extends ComponentPropsWithoutRef<"select"> {
  label: string;
  name: string;
  value?: string;
  options: { label: string; value: string }[];
  message?: string;
  status?: Status;
}

// TODO: refarctor this component to make costumizing it easier
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      name,
      value,
      options,
      message,
      status = "normal",
      className,
      ...rest
    },
    ref,
  ) => {
    const error = status === "error";
    const done = status === "done";
    const id = useId();

    const errorMessageId = useId();

    const ariaDescribedBy = error ? errorMessageId : undefined;

    return (
      <div className={cn("flex flex-col gap-y-2", className)}>
        <label
          className={cn(
            "dark:text-[#62636a] text-opacity-50 text-sm first-letter:uppercase",
            {
              "text-error": !!error,
              "text-done": done,
            },
          )}
          htmlFor={id}
        >
          {label}
        </label>
        <div
          className={cn(
            "w-full bg-transparent outline-none border border-text border-opacity-25 py-3.5 px-[1.125em] rounded-lg font-medium flex items-center",
            {
              "border-error": error,
              "border-done": done,
            },
          )}
        >
          <select
            ref={ref}
            id={id}
            {...rest}
            name={name}
            value={value}
            className="w-full bg-transparent outline-none"
            aria-describedby={ariaDescribedBy}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="py-1 px-2"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {!!message && (
          <span
            role="alert"
            id={errorMessageId}
            aria-live="assertive"
            aria-atomic="true"
            data-testid={`error-message-${name}`}
            className={cn("text-xs px-[1.125em]", {
              "text-red-500": error,
              "text-blue-500": done,
            })}
          >
            {message}
          </span>
        )}
      </div>
    );
  },
);

export default Select;
