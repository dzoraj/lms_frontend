import { Injectable } from '@angular/core';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private rxStomp: RxStomp;

  constructor() {
    const config: RxStompConfig = {

      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      debug: (msg: string) => {
        console.log(new Date(), msg);
      }
    };

    this.rxStomp = new RxStomp();
    this.rxStomp.configure(config);
    this.rxStomp.activate();
  }


  getNotifications(): Observable<any> {
    return this.rxStomp.watch('/topic/notifications').pipe(
      map(message => {
        try {
          return JSON.parse(message.body);
        } catch (e) {
          console.error('Error parsing STOMP message body as JSON', e, message.body);
          return null;
        }
      })
    );
  }


  sendNotification(destination: string, body: any): void {
    this.rxStomp.publish({ destination, body: JSON.stringify(body) });
  }
}
