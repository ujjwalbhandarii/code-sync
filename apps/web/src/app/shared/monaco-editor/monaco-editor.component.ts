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
import { SocketService } from '@/app/services/socket.service';

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
  private monacoEditorInstance: editor.IStandaloneCodeEditor | undefined; // To store editor instance

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private socketService: SocketService
  ) {}

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

  // Capture editor instance after initialization
  onEditorInit(editorInstance: editor.IStandaloneCodeEditor) {
    this.monacoEditorInstance = editorInstance;

    // Listen for cursor position changes
    this.monacoEditorInstance.onDidChangeCursorPosition((e) => {
      const position = this.monacoEditorInstance!.getPosition();
      if (position) {
        // Emit cursor position to the server
        this.socketService.sendCursorPosition({
          lineNumber: position.lineNumber,
          column: position.column,
        });
      }
    });
  }

  // Show remote cursor position
  showRemoteCursor(position: { lineNumber: number; column: number }) {
    if (this.monacoEditorInstance) {
      const decorations = this.monacoEditorInstance.deltaDecorations(
        [],
        [
          {
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            options: {
              className: 'remote-cursor', // Style it to make it visible
            },
          },
        ]
      );
    }
  }
}
