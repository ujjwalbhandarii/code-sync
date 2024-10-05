import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import type { editor } from 'monaco-editor';
import { NuMonacoEditorModule } from '@ng-util/monaco-editor';

@Component({
  selector: 'app-monaco-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NuMonacoEditorModule],
  template: `
    <div [ngStyle]="containerStyle">
      @if (editorOptions) {
      <nu-monaco-editor
        class="monaco-editor"
        [(ngModel)]="editorValue"
        [options]="editorOptions"
        (ngModelChange)="onValueChange($event)"
      ></nu-monaco-editor>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100% !important;
        height: 100% !important;
      }

      .monaco-editor {
        width: 100% !important;
        height: 100% !important;
      }
    `,
  ],
})
export class MonacoEditorComponent implements OnInit, OnChanges {
  @Input() value: string = '';
  @Input() width: string = '100%';
  @Input() height: string = '100%';
  @Input() theme: string = 'vs-dark';
  @Input() language: string = 'typescript';
  @Output() valueChange = new EventEmitter<string>();

  editorValue: string = '';
  containerStyle: { [key: string]: string } = {};
  editorOptions: editor.IStandaloneEditorConstructionOptions | undefined;
  private isInternalChange = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.editorValue = this.value;
    this.containerStyle = {
      height: this.height,
      width: this.width,
    };

    if (isPlatformBrowser(this.platformId)) {
      this.editorOptions = {
        tabSize: 4,
        fontSize: 16,
        wordWrap: 'on',
        theme: this.theme,
        language: this.language,
        minimap: { enabled: true },
        padding: {
          top: 20,
          bottom: 20,
        },
      };
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && !changes['value'].firstChange) {
      const newValue = changes['value'].currentValue;
      if (newValue !== this.editorValue && !this.isInternalChange) {
        this.editorValue = newValue;
      }
    }
  }

  onValueChange(newValue: string) {
    this.isInternalChange = true;
    this.valueChange.emit(newValue);
    setTimeout(() => {
      this.isInternalChange = false;
    }, 0);
  }
}
