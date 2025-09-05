import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium font-body ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-300 ease-luxury",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-elegant",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Luxury variants
        luxury: "bg-gradient-primary text-primary-foreground hover:scale-105 shadow-elegant hover:shadow-luxury magnetic-hover",
        champagne: "bg-gradient-champagne text-accent-foreground hover:scale-105 shadow-champagne hover:shadow-luxury magnetic-hover",
        hero: "bg-primary text-primary-foreground border-2 border-primary/20 hover:bg-primary/90 hover:border-primary/30 hover:scale-105 shadow-luxury",
        glass: "bg-background/80 backdrop-blur-md border border-border/50 text-foreground hover:bg-background/90 hover:border-border shadow-soft",
        premium: "bg-card text-card-foreground border-2 border-accent/20 hover:border-accent/40 hover:shadow-champagne luxury-card",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-base",
        xl: "h-16 rounded-xl px-12 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
