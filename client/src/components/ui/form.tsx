import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

function cn(...classes: Array<string | undefined |null | false>) {
  return classes.filter(Boolean).join(" ");
}

export const Form = FormProvider;

/* ------------------------------------------------ */
/* Form Field Context */
/* ------------------------------------------------ */

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext =
  React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue
  );

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider
      value={{ name: props.name }}
    >
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

/* ------------------------------------------------ */
/* Form Item Context */
/* ------------------------------------------------ */

type FormItemContextValue = {
  id: string;
};

const FormItemContext =
  React.createContext<FormItemContextValue>(
    {} as FormItemContextValue
  );

export function FormItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        className={cn("space-y-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

/* ------------------------------------------------ */
/* Hook */
/* ------------------------------------------------ */

function useFormField() {
  const fieldContext =
    React.useContext(FormFieldContext);

  const itemContext =
    React.useContext(FormItemContext);

  const {
    getFieldState,
    formState,
  } = useFormContext();

  const fieldState = getFieldState(
    fieldContext.name,
    formState
  );

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

/* ------------------------------------------------ */
/* Label */
/* ------------------------------------------------ */

export function FormLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { formItemId } = useFormField();

  return (
    <label
      htmlFor={formItemId}
      className={cn(
        "text-sm font-medium",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------ */
/* Control */
/* ------------------------------------------------ */

export function FormControl(
  props: React.ComponentProps<typeof Slot>
) {
  const {
    error,
    formItemId,
    formDescriptionId,
    formMessageId,
  } = useFormField();

  return (
    <Slot
      id={formItemId}
      aria-describedby={
        error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

/* ------------------------------------------------ */
/* Description */
/* ------------------------------------------------ */

export function FormDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { formDescriptionId } =
    useFormField();

  return (
    <p
      id={formDescriptionId}
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------ */
/* Message */
/* ------------------------------------------------ */

export function FormMessage({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const {
    error,
    formMessageId,
  } = useFormField();

  const body = error
    ? String(error.message)
    : children;

  if (!body) return null;

  return (
    <p
      id={formMessageId}
      className={cn(
        "text-sm font-medium text-red-600",
        className
      )}
      {...props}
    >
      {body}
    </p>
  );
}