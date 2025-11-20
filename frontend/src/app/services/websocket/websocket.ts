import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
@Injectable({
  providedIn: 'root',
})
export class Websocket {
  private socket = io('http://localhost:5000');

  onAlert(callback: (data: any) => void) {
    this.socket.on('alert', callback);
  }
}
