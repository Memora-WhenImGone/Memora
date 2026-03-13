"use client";
import React from "react";

type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string;
};

export const Accordion: React.FC<AccordionProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

type AccordionItemProps = React.HTMLAttributes<HTMLDetailsElement> & {
  value?: string;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ children, className }) => {
  return <details className={className}>{children}</details>;
};

type TriggerProps = React.HTMLAttributes<HTMLElement>;

export const AccordionTrigger: React.FC<TriggerProps> = ({ children, className }) => {
  return (
    <summary className={className + " list-none cursor-pointer select-none flex items-center justify-between gap-3"}>
      {children}
      <svg className="h-5 w-5 text-gray-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 3a1 1 0 01.832.445l5 7a1 1 0 01-1.664 1.11L10 5.882 5.832 11.555a1 1 0 11-1.664-1.11l5-7A1 1 0 0110 3z" clipRule="evenodd" />
      </svg>
    </summary>
  );
};

type ContentProps = React.HTMLAttributes<HTMLDivElement>;

export const AccordionContent: React.FC<ContentProps> = ({ children, className }) => {
  return <div className={className + " px-1 py-2 text-gray-600"}>{children}</div>;
};

