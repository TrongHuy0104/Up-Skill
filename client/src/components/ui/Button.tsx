import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-primary-800 text-primary-50 shadow hover:bg-accent-900',
                primary: 'bg-primary-800 text-primary-50 shadow bg-accent-900',
                destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline: 'border border-input bg-primary-50 border-primary-100 shadow-sm hover:bg-primary-100',
                secondary: 'bg-accent-900 text-primary-50 shadow bg-accent-900 hover:bg-accent-700',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                ['active-tab']: 'bg-primary-800 text-primary-50 shadow bg-primary-800'
            },
            size: {
                default: 'rounded px-9 py-3',
                combobox: 'rounded px-3 py-2',
                rounded: 'rounded-full px-9 py-3',
                xs: 'rounded py-2 px-2',
                sm: 'rounded text-[15px] py-2 px-5',
                lg: 'rounded px-[35px] py-3 text-base',
                xl: 'rounded px-[49px] py-3 text-base',
                icon: 'h-9 w-9'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
