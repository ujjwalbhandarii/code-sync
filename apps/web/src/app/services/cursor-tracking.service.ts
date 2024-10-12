import { Injectable } from '@angular/core';
import { fromEvent, map, Observable } from 'rxjs';

type MouseCoordinates = {
  x: number;
  y: number;
};

@Injectable({
  providedIn: 'root',
})
export class CursorTrackingService {
  constructor() {
    this.trackCursorMovement();
  }

  private cursorPosition$ = new Observable<MouseCoordinates>();

  // Observable that listens to 'mousemove' events on the document
  private trackCursorMovement(): void {
    this.cursorPosition$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
      map((event: MouseEvent) => ({
        x: event.clientX,
        y: event.clientY,
      }))
    );
  }

  // To allow components to subscribe to cursor position updates
  getCursorPosition(): Observable<MouseCoordinates> {
    return this.cursorPosition$;
  }
}
