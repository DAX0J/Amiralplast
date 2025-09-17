"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Beautiful HTML select wrapper components with enhanced styling
const baseSelectClass = "w-full text-lg h-14 rounded-2xl border-2 font-arabic bg-gradient-to-r from-white to-warm-beige/5 focus:from-warm-beige/10 focus:to-white transition-all duration-300 hover:shadow-md px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red cursor-pointer appearance-none";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { onValueChange?: (value: string) => void }>(
  ({ onValueChange, onChange, className, style, ...props }, ref) => (
    <select
      ref={ref}
      onChange={(e) => {
        onChange?.(e);
        onValueChange?.(e.target.value);
      }}
      className={cn(baseSelectClass, className)}
      style={{
        backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23dc2626' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
        backgroundPosition: "left 0.75rem center",
        backgroundSize: "1.5em 1.5em",
        backgroundRepeat: "no-repeat",
        ...style
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

const SelectValue = ({ placeholder, ...props }: { placeholder?: string } & React.HTMLAttributes<HTMLSpanElement>) => (
  <span {...props}>
    {placeholder}
  </span>
);

const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(baseSelectClass, "cursor-pointer", className)}
      {...props}
    >
      {children}
    </div>
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
