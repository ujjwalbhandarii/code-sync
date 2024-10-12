import { Component } from '@angular/core';
import { CursorTrackingService } from '@/app/services/cursor-tracking.service';

@Component({
  selector: 'app-mouse-track',
  standalone: true,
  imports: [],
  template: `
    @if(otherUserX && otherUserY){
    <div
      class="usermouse"
      [style.left.px]="otherUserX"
      [style.top.px]="otherUserY"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/587/587376.png"
        alt="cursor image"
        class="h-5 w-full"
      />
      <p class="absolute top-5 left-0">
        {{ otherSocketId }}
      </p>
    </div>
    }
  `,

  styles: [
    `
      .usermouse {
        position: absolute;
        filter: invert(1);
        color: white;
      }
    `,
  ],
})
export class MouseTrackComponent {
  userX: number = 0;
  userY: number = 0;

  otherUserX: number = 0;
  otherUserY: number = 0;
  otherSocketId: string = '';

  constructor(private cursorTrackingService: CursorTrackingService) {}

  ngOnInit(): void {
    // Subscribe to the local user's cursor movement
    this.cursorTrackingService.getCursorPosition().subscribe(({ x, y }) => {
      this.userX = x;
      this.userY = y;
    });

    // Subscribe to other users' cursor movements
    this.cursorTrackingService
      .getOtherUsersCursorPosition()
      .subscribe(({ x, y, socketId }) => {
        this.otherUserX = x;
        this.otherUserY = y;
        this.otherSocketId = socketId;
      });
  }
}
