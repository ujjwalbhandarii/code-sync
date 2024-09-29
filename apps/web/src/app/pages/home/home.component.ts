import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonacoEditorComponent } from '@/app/shared/components/monaco-editor/monaco-editor.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, MonacoEditorComponent],
})
export class HomeComponent {
  editorValue: string = 'const a = 1;';

  onValueChange(newValue: string) {
    console.log('New value:', newValue);
  }
}
