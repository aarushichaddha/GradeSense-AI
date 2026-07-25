import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, children, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-[#1e2945] rounded-xl font-mono text-xs shadow-xs bg-white dark:bg-[#0e1424]">
      <table className={cn("w-full text-left border-collapse", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("bg-slate-50 dark:bg-[#0b101d] border-b border-slate-200 dark:border-[#1e2945] text-[10px] uppercase font-sans text-slate-500 dark:text-slate-400 font-bold tracking-wider", className)} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-slate-100 dark:divide-[#1e2945] bg-white dark:bg-[#0e1424]", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("hover:bg-slate-50/80 dark:hover:bg-[#141c30] transition-colors duration-150 cursor-pointer", className)} {...props}>
      {children}
    </tr>
  );
}

export function TableHead({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn("px-4 py-3 font-bold text-slate-700 dark:text-slate-300", className)} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-4 py-3 text-slate-800 dark:text-slate-200 font-sans", className)} {...props}>
      {children}
    </td>
  );
}
