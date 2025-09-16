import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NotificationService, NotificationDTO } from '../../service/notification-service/notification.service';

@Component({
  selector: 'app-sa-general-notifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sa-general-notifications.component.html',
  styleUrls: ['./sa-general-notifications.component.css']
})
export class SaGeneralNotificationsComponent implements OnInit {
  form!: FormGroup;
  items: NotificationDTO[] = [];
  posting = false;

  constructor(private fb: FormBuilder, private api: NotificationService) {}

  ngOnInit(): void {
    this.form = this.fb.group({ title: ['', Validators.required], content: ['', Validators.required] });
    this.api.listGeneral().subscribe(x => this.items = x ?? []);
    this.api.watchGeneralNotifications().subscribe(n => { if (n) this.items = [n, ...this.items]; });
  }

  submit() {
    if (this.form.invalid || this.posting) return;
    this.posting = true;
    const dto: NotificationDTO = { title: this.form.value.title, content: this.form.value.content, courseRealizationId: null, teacherOnCourseId: null };
    this.api.createGeneral(dto).subscribe({
      next: () => { this.form.reset(); this.posting = false; },
      error: () => { this.posting = false; }
    });
  }
}
