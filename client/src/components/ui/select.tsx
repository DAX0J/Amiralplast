"use client"

import * as React from "react"

// Simple HTML select wrapper components
const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { onValueChange?: (value: string) => void }>(
  ({ onValueChange, onChange, ...props }, ref) => (
    <select
      ref={ref}
      onChange={(e) => {
        onChange?.(e);
        onValueChange?.(e.target.value);
      }}
      {...props}
    />
  )
);
Select.displayName = "Select"

const SelectGroup = ({ children, ...props }: React.HTMLAttributes<HTMLOptGroupElement>) => (
  <optgroup {...props}>
    {children}
  </optgroup>
);

const SelectValue = ({ placeholder, ...props }: { placeholder?: string } & React.HTMLAttributes<HTMLOptionElement>) => (
  <option value="" disabled {...props}>
    {placeholder}
  </option>
);

const SelectTrigger = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ children, ...props }, ref) => (
    <select ref={ref} {...props}>
      {children}
    </select>
  )
);
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <>{children}</>
);

const SelectLabel = ({ children, ...props }: React.HTMLAttributes<HTMLOptGroupElement>) => (
  <optgroup label={children as string} {...props} />
);

const SelectItem = React.forwardRef<HTMLOptionElement, React.OptionHTMLAttributes<HTMLOptionElement>>(
  ({ children, ...props }, ref) => (
    <option ref={ref} {...props}>
      {children}
    </option>
  )
);
SelectItem.displayName = "SelectItem"

const SelectSeparator = ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => (
  <hr {...props} />
);

const SelectScrollUpButton = () => null;
const SelectScrollDownButton = () => null;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
