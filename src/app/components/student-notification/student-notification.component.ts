import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification-service/notification.service';

@Component({
  selector: 'app-student-notifications',
  standalone: true,
  imports: [CommonModule],
 templateUrl: './student-notification.component.html',
 styleUrls: ['./student-notification.component.css']
})
export class StudentNotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notifService: NotificationService) {}

ngOnInit(): void {
  this.notifService.getNotifications().subscribe(notification => {
    if (notification) {
      this.notifications = [...this.notifications, notification];
    }
  });
}

}
