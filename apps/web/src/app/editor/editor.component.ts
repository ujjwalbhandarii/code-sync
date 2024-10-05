import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MonacoEditorComponent } from '@/app/shared/monaco-editor/monaco-editor.component';
import { SocketService } from '../services/socket.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-editor',
  imports: [MonacoEditorComponent],
  templateUrl: './editor.component.html',
})
export class EditorComponent {
  roomId!: string | null;
  username!: string | null;
  editorValue: string = 'const apple = 1;';
  private isUpdatingFromServer = false;

  private codeChangeSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.route.queryParamMap.subscribe((params) => {
      this.roomId = params.get('roomId');
      this.username = params.get('username');

      if (!this.username && !this.roomId) {
        this.router.navigate(['/']);
      }
    });

    this.socketService.joinRoom(this.roomId!, this.username!);

    // Subscribe to code changes from the server
    this.codeChangeSubscription = this.socketService.onCodeChange().subscribe({
      next: (data) => {
        if (data.code !== undefined) {
          this.isUpdatingFromServer = true;
          console.log(data.code);
          this.editorValue = data.code;
          // Use setTimeout to reset the flag after the update
          setTimeout(() => {
            this.isUpdatingFromServer = false;
          }, 0);
        }
      },
      error: (error) => {
        console.error('Error receiving code changes:', error);
      },
    });
  }

  onValueChange(newValue: string) {
    // Only emit changes if they're not from the server
    if (!this.isUpdatingFromServer) {
      this.editorValue = newValue;
      console.log('Editor value changed locally to:', newValue);
      this.socketService.codeChange(this.roomId!, newValue);
    }
  }

  ngOnDestroy() {
    if (this.codeChangeSubscription) {
      this.codeChangeSubscription.unsubscribe();
    }
  }
}
