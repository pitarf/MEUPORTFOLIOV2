import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext({
    value: undefined,
    onValueChange: undefined,
});

const Tabs = React.forwardRef(({ className, value, defaultValue, onValueChange, children, ...props }, ref) => {
    const [selectedTab, setSelectedTab] = React.useState(defaultValue || value);

    const currentValue = value !== undefined ? value : selectedTab;
    const handleValueChange = (newVal) => {
        if (value === undefined) {
            setSelectedTab(newVal);
        }
        onValueChange?.(newVal);
    };

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div
                ref={ref}
                className={cn("w-full", className)}
                {...props}
            >
                {children}
            </div>
        </TabsContext.Provider>
    );
});
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, isActive, onClick, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const active = isActive !== undefined
        ? Boolean(isActive)
        : (context.value !== undefined && value !== undefined ? context.value === value : false);

    const handleClick = (e) => {
        onClick?.(e);
        if (value !== undefined && context.onValueChange) {
            context.onValueChange(value);
        }
    };

    return (
        <button
            ref={ref}
            type="button"
            role="tab"
            aria-selected={active}
            data-state={active ? "active" : "inactive"}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                active
                    ? "bg-background text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                className
            )}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, isActive, children, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    const active = isActive !== undefined
        ? Boolean(isActive)
        : (context.value !== undefined && value !== undefined ? context.value === value : false);

    if (!active) return null;

    return (
        <div
            ref={ref}
            role="tabpanel"
            data-state={active ? "active" : "inactive"}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
