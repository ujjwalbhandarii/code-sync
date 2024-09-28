import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NuMonacoEditorModule } from '@ng-util/monaco-editor';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [NuMonacoEditorModule, CommonModule, FormsModule],
})
export class HomeComponent {
  value: string = 'const a = 1;';

  editorOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    theme: 'vs-dark',
    language: 'typescript',
    fontSize: 16,
    wordWrap: 'on',
    minimap: { enabled: true },
    tabSize: 4,
    padding: {
      top: 20,
      bottom: 20,
    },
  };

  onValueChange(newValue: string) {
    this.value = newValue;
  }
}
