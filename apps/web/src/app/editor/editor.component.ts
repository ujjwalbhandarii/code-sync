import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

import { SocketService } from '@/app/services/socket.service';
import { MonacoEditorComponent } from '@/app/shared/monaco-editor/monaco-editor.component';

@Component({
  standalone: true,
  selector: 'app-editor',
  imports: [MonacoEditorComponent],
  templateUrl: './editor.component.html',
})
export class EditorComponent {
  roomId!: string | null;
  username!: string | null;
  private isUpdatingFromServer = false;
  editorValue: string = 'const apple = 1;';

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

    this.route.queryParamMap.subscribe((params): void => {
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
          this.editorValue = data.code;
          this.isUpdatingFromServer = true;

          // Reset the flag after the update
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
      this.socketService.codeChange(this.roomId!, newValue);
    }
  }

  ngOnDestroy() {
    if (this.codeChangeSubscription) {
      this.codeChangeSubscription.unsubscribe();
    }
  }
}
