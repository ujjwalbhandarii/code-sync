import {
  FormGroup,
  Validators,
  FormControl,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
``;
import { InputComponent } from '@/app/shared/ui/input/input.component';
import { ButtonComponent } from '@/app/shared/ui/button/button.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    FormsModule,
    CommonModule,
    InputComponent,
    ButtonComponent,
    ReactiveFormsModule,
  ],
})
export class HomeComponent {
  editorForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.editorForm = this.formBuilder.group({
      roomId: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
    });
  }

  handleSubmit() {
    if (this.editorForm.valid) {
      const formValues = this.editorForm.value;

      this.router.navigate(['/editor'], {
        queryParams: {
          roomId: formValues.roomId,
          username: formValues.username,
        },
      });

      this.editorForm.reset();
    }
  }
}
