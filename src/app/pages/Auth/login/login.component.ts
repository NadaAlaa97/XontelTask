import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      
      const { email, password, rememberMe } = this.loginForm.value;
  
      setTimeout(() => {
        this.loading = false;
        
        const tempToken = 'tempToken';
        
        this.authService.saveToken(tempToken, rememberMe);
        
        this.router.navigate(['/home']);
      }, 1000);
      
      /*
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.loading = false;
          
          if (response && response.token) {
            if (rememberMe) {
              this.authService.saveToken(response.token, true);
            } else {
              this.authService.saveToken(response.token, false);
            }
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.loading = false;
          this.router.navigate(['/home']);

          console.error('Login error:', err);
        }
      });
      */
    }
  }
}
