import { Component,OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { LoginService} from "../../services/login.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  // users: any[] = []; // Assuming your user data structure
  loginError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  get emailControl() {
    return this.loginForm.get('email');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {}

  onLoginClick() {
    // Check if both email and password fields are not empty
    if (this.emailControl?.value && this.passwordControl?.value) {
      // Proceed with login attempt if form is valid
      if (this.loginForm.valid) {
        const enteredEmail = this.emailControl?.value;
        const enteredPassword = this.passwordControl?.value;

        this.loginService.login(enteredEmail, enteredPassword).subscribe(
          (data: any) => {
            console.log('Login response:', data);
            this.handleLoginResponse(data);
          },
          error => {
            console.error('Error:', error);
            this.handleFailedLogin();
          }
        );
      } else {
        console.log('Form is invalid');
      }
    } else {
      console.log('Email or password field is empty');
    }
  }


  private handleLoginResponse(response: any) {
    if (response.message === 'Login successful') {
      console.log('Login successful');
      this.router.navigate(['/service-handler']);
    } else {
      console.log('Login failed');
      this.handleFailedLogin();
    }
  }

  private handleFailedLogin() {
    this.loginError = true;
  }

  resetForm(form: FormGroup): void {
    form.reset();
  }
}

