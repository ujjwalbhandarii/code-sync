import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { cva } from 'class-variance-authority';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: 'solid' | 'outline' | 'ghost' | 'danger' = 'solid';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled: boolean = false;
  @Input() class: string = '';

  get buttonClass(): string {
    return buttonVariants({
      variant: this.variant,
      size: this.size,
      class: this.class,
    });
  }
}

const buttonVariants = cva(
  'w-full disabled:cursor-not-allowed rounded-lg font-semibold focus:outline-none flex items-center gap-2 justify-center shadow-sm whitespace-nowrap disabled:cursor-not-allowed disabled:bg-primary/40',
  {
    variants: {
      variant: {
        solid: 'bg-primary text-white hover:bg-primary/90',
        danger: 'bg-red-700 text-white hover:bg-red-800',
        outline:
          'border-2 text-secondary border-secondary bg-transparent hover:bg-secondary/10',
        ghost:
          'transition-colors duration-300 text-secondary bg-transparent hover:underline underline-offset-4 shadow-none',
      },
      size: {
        sm: 'px-4 py-2 text-[0.8rem]',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  }
);
