import { Observable } from 'rxjs';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { isPlatformBrowser } from '@angular/common';

export const ACTIONS = {
  JOIN: 'join',
  JOINED: 'joined',
  CODE_CHANGE: 'code-change',
  DISCONNECTING: 'disconnecting',
  DISCONNECTED: 'disconnected',
};

const config: SocketIoConfig = {
  url: 'http://localhost:9999',
  options: {
    transports: ['websocket'],
    autoConnect: true,
  },
};

@Injectable({
  providedIn: 'root',
})
export class SocketService extends Socket {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    super(config);

    if (isPlatformBrowser(this.platformId)) {
      this.connect();

      this.on('connect', () => {
        console.log('Socket connected with ID:', this.ioSocket.id);
      });

      this.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error);
      });
    }
  }

  joinRoom(roomId: string, username: string) {
    console.log('Joining room:', roomId, 'as', username);
    this.emit(ACTIONS.JOIN, { roomId, username });
  }

  codeChange(roomId: string, code: string) {
    console.log('Emitting code change for room:', roomId);
    this.emit(ACTIONS.CODE_CHANGE, { roomId, code });
  }

  onCodeChange(): Observable<{ code: string }> {
    return new Observable((observer) => {
      this.on(ACTIONS.CODE_CHANGE, (data: { code: string }) => {
        console.log('Received code change:', data);
        observer.next(data);
      });
    });
  }

  onJoined(): Observable<any> {
    return new Observable((observer) => {
      this.on(ACTIONS.JOINED, (data: any) => {
        console.log('Joined event received:', data);
        observer.next(data);
      });
    });
  }
}
