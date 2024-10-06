import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Socket, SocketIoConfig } from 'ngx-socket-io';

export const ACTIONS = {
  JOIN: 'join',
  JOINED: 'joined',
  CONNECTION: 'connection',
  CODE_CHANGE: 'code-change',
  DISCONNECTING: 'disconnecting',
  DISCONNECTED: 'disconnected',
  DISCONNECT: 'disconnect',
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

      //connect
      this.on(ACTIONS.CONNECTION, () => {
        console.log('Socket connected with ID:', this.ioSocket.id);
      });

      //connect_error
      this.on('connect_error', (error: Error) => {
        console.error('Socket connection error:', error);
      });
    }
  }

  joinRoom(roomId: string, username: string) {
    this.emit(ACTIONS.JOIN, { roomId, username });
  }

  codeChange(roomId: string, code: string) {
    this.emit(ACTIONS.CODE_CHANGE, { roomId, code });
  }

  onCodeChange(): Observable<{ code: string }> {
    return new Observable((observer) => {
      this.on(ACTIONS.CODE_CHANGE, (data: { code: string }) => {
        observer.next(data);
      });
    });
  }

  onJoined(): Observable<any> {
    return new Observable((observer) => {
      this.on(ACTIONS.JOINED, (data: any) => {
        observer.next(data);
      });
    });
  }
}
