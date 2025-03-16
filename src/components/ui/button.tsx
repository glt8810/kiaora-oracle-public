import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive min-h-[44px] touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-deep-sea-green text-ethereal-mist shadow-xs hover:bg-deep-sea-green/90 hover:border-soft-gold/50 hover:shadow-[0_0_10px_rgba(212,175,55,0.2)]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:border-soft-gold/30",
        outline:
          "border border-deep-sea-green bg-transparent shadow-xs hover:bg-deep-sea-green/10 hover:text-ethereal-mist hover:border-soft-gold/50",
        secondary:
          "bg-twilight-blue text-ethereal-mist shadow-xs hover:bg-twilight-blue/80 hover:border-soft-gold/50 hover:shadow-[0_0_10px_rgba(212,175,55,0.15)]",
        ghost:
          "hover:bg-mystic-purple/20 hover:text-soft-gold hover:shadow-[0_0_8px_rgba(212,175,55,0.1)]",
        link: "text-soft-gold underline-offset-4 hover:underline",
        oracle:
          "bg-mystic-purple text-soft-gold shadow-xs hover:bg-mystic-purple/90 hover:border-soft-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.25)]",
        mystic:
          "bg-mystic-purple text-ethereal-mist border border-soft-gold/20 shadow-xs hover:bg-mystic-purple/90 hover:border-soft-gold/70 hover:shadow-[0_0_12px_rgba(212,175,55,0.2)]",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 md:h-12 rounded-xl px-5 md:px-6 has-[>svg]:px-4 text-base",
        icon: "size-10 md:size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
