import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { fromEvent, map, Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from './socket.service';
import { isPlatformBrowser } from '@angular/common';

type MouseCoordinates = {
  x: number;
  y: number;
};

@Injectable({
  providedIn: 'root',
})
export class CursorTrackingService {
  private roomId$ = new BehaviorSubject<string | null>(null);
  private cursorPosition$!: Observable<MouseCoordinates>;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeService();
    }
  }

  private initializeService(): void {
    this.route.queryParamMap.subscribe((params) => {
      const roomId = params.get('roomId');
      this.roomId$.next(roomId);
    });

    this.cursorPosition$ = this.trackCursorMovement();
  }

  private trackCursorMovement(): Observable<MouseCoordinates> {
    return fromEvent<MouseEvent>(document, 'mousemove').pipe(
      map((event: MouseEvent) => {
        const coordinates = { x: event.pageX, y: event.pageY };
        this.sendCursorPosition(coordinates);
        return coordinates;
      })
    );
  }

  private sendCursorPosition(coordinates: MouseCoordinates): void {
    const roomId = this.roomId$.getValue();
    if (roomId) {
      this.socketService.sendMousePosition(
        roomId,
        coordinates.x,
        coordinates.y
      );
    }
  }

  getCursorPosition(): Observable<MouseCoordinates> {
    return this.cursorPosition$;
  }

  getOtherUsersCursorPosition(): Observable<{
    x: number;
    y: number;
    socketId: string;
  }> {
    return this.socketService.onMouseMove();
  }

  getRoomId(): Observable<string | null> {
    return this.roomId$.asObservable();
  }
}
