import { Injectable } from '@angular/core';
import { RxStomp, RxStompConfig } from '@stomp/rx-stomp';
import SockJS from 'sockjs-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface NotificationDTO {
  id?: number;
  title: string;
  content: string;
  timePosted?: string;
  courseRealizationId?: number | null;
  teacherOnCourseId?: number | null;
  attachmentIds?: number[];
  courseName?: string | null;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private rxStomp: RxStomp;
  private base = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {
    const config: RxStompConfig = {
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      debug: () => {}
    };
    this.rxStomp = new RxStomp();
    this.rxStomp.configure(config);
    this.rxStomp.activate();
  }

  private auth() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
    return { headers };
  }

  watchCourseNotifications(): Observable<NotificationDTO | null> {
    return this.rxStomp.watch('/topic/notifications').pipe(
      map(m => {
        try { return JSON.parse(m.body) as NotificationDTO; } catch { return null; }
      })
    );
  }

  watchGeneralNotifications(): Observable<NotificationDTO | null> {
    return this.rxStomp.watch('/topic/general-notifications').pipe(
      map(m => {
        try { return JSON.parse(m.body) as NotificationDTO; } catch { return null; }
      })
    );
  }

  listGeneral(): Observable<NotificationDTO[]> {
    return this.http.get<NotificationDTO[]>(`${this.base}/general`);
  }

  createGeneral(dto: NotificationDTO): Observable<NotificationDTO> {
    return this.http.post<NotificationDTO>(`${this.base}/general`, dto, this.auth());
  }
}
