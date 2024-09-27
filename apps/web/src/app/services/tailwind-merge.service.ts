import { twMerge } from 'tailwind-merge';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TailwindMergeService {
  constructor() {}

  mergeClasses(...classes: string[]): string {
    return twMerge(...classes);
  }
}
