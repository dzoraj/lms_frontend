import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, NotificationDTO } from '../../service/notification-service/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-student-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-notification.component.html',
  styleUrls: ['./student-notification.component.css']
})
export class StudentNotificationsComponent implements OnInit, OnDestroy {
  @Input() courseInitial: NotificationDTO[] = [];
  general: NotificationDTO[] = [];
  course: NotificationDTO[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notif: NotificationService) {}

  ngOnInit(): void {
    this.course = this.dedupSort([...this.courseInitial]);
    this.notif.listGeneral().pipe(takeUntil(this.destroy$)).subscribe(x => this.general = this.dedupSort(x ?? []));
    this.notif.watchGeneralNotifications().pipe(takeUntil(this.destroy$)).subscribe(n => { if (n) this.general = this.dedupSort([n, ...this.general]); });
    this.notif.watchCourseNotifications().pipe(takeUntil(this.destroy$)).subscribe(n => { if (n) this.course = this.dedupSort([n, ...this.course]); });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById = (i: number, n: NotificationDTO) => n.id ?? i;

  private dedupSort(list: NotificationDTO[]) {
    const m = new Map<number | undefined, NotificationDTO>();
    for (const n of list) m.set(n.id, n);
    return Array.from(m.values()).sort((a, b) => new Date(b.timePosted || '').getTime() - new Date(a.timePosted || '').getTime());
  }
}
