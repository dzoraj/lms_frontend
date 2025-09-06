import { Component, OnInit } from '@angular/core';
import { QuestionBase } from '../../model/questions/question-base';
import { QuestionService } from '../../service/question/question.service';
import { LoginService } from '../../service/loginService/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../../dynamic-components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  questions: QuestionBase<string>[] = [];
  errorMessage: string | null = null;

  constructor(
    private questionService: QuestionService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.questionService.getLoginQuestions().subscribe((qs) => (this.questions = qs));
  }

  onSubmit(model: any) {
    console.log("Submitting login with", model); 
    this.errorMessage = null;
    this.loginService.login(model).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = 'Login failed: Invalid email or password';
        console.error("Login error:", err);
      },
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }

  onBack() {
    this.router.navigate(['/home']);
  }
}
