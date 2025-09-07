import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../../model/questions/question-base';
import { QuestionService } from '../../service/question/question.service';
import { LoginService } from '../../service/loginService/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../../dynamic-components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  questions: QuestionBase<string>[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private questionService: QuestionService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.questionService.getRegisterQuestions().subscribe((qs) => {
      this.questions = qs;
    });
  }

  onSubmit(model: any) {
    this.errorMessage = null;
    this.successMessage = null;
    if (model.password !== model.confirmPassword) {
      confirm('Passwords do not match! Please try again.');
      return; 
    }
    if (model.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(model.email)) {
      confirm('Invalid email format! Please try again.');
      return;}
    if (model.jmbg && !/^\d{13}$/.test(model.jmbg)) {
      confirm('JMBG must be exactly 13 digits. Please try again.');
      return;
    }



    this.loginService.register(model).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed: ' + (err.error || 'Email already in use or server error.');
        console.error('Register error:', err);
      },
    });
  }
  goToLogin() {
    this.router.navigate(['/login']);
  }
  onBack() {
    this.router.navigate(['/home']);
  }
}
