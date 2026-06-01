import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("w-full", className)}
        {...props}
    />
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground bg-gray-800/50",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, isActive, onClick, children, ...props }, ref) => (
    <button
        ref={ref}
        type="button"
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            isActive
                ? "bg-background text-foreground shadow-sm bg-gray-700 text-white"
                : "hover:bg-gray-800 hover:text-gray-200",
            className
        )}
        onClick={onClick}
        {...props}
    >
        {children}
    </button>
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, isActive, children, ...props }, ref) => {
    if (!isActive) return null;
    return (
        <div
            ref={ref}
            className={cn(
                "mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
