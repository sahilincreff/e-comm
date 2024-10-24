import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule, FormsModule, FormArray} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!:FormGroup;

  constructor(private formBuilder:FormBuilder, private authService: AuthService, private router: Router){
    this.loginForm=this.formBuilder.group({
      email:new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.min(6), Validators.max(15)])
    })
  }

  handleSubmit(){
    if(this.loginForm.valid){
      const {email, password}=this.loginForm.value;
      const user=this.authService.validateUser(email, password);
      if(user){
        console.log(user);
        this.authService.setCurrentUser(user);
        this.router.navigate(['/']);
      }else{
        console.log('wrong password');
      }
    }
  }

}
