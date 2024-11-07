import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(15)]]
    });
  }

  handleSubmit() {
    if(this.loginForm.valid){
      const { email, password } = this.loginForm.value;
      this.authService.validateUser(email, password).subscribe(user => {
        if(user){
          this.authService.setCurrentUser(user);
          this.router.navigate(['/']);
        } else {
          alert('wrong password');
        }
      });
    }
  }
}
