export interface UserSocketMap {
  [socketId: string]: string;
}

export interface JoinData {
  roomId: string;
  username: string;
}

export interface CodeChangeData {
  roomId: string;
  code: string;
}

export interface SyncCodeData {
  socketId: string;
  code: string;
}
