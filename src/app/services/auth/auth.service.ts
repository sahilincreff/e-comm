import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from 'src/app/shared/models/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersApiUrl='assets/constants/users.json'
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient){
    
  }

  ngOnInit(){
    // this.authService.currentUser$.subscribe(user => {
    //   this.currentUser = user;
    //   this.userLoggedIn = !!user; 
    // }
  }

  validateUser(email: string, password: string){
    // return this.http.get<User[]>(this.usersApiUrl).pipe(
    //   map(users => {
    //     const user=users.find(user: User => user.email === email && user.password === password);
    //     return user || null;
    // );
    // this.http.get<User[]>(this.usersApiUrl).pipe((data)=>{
    //   console.log(data);
    // })
    if(email==='sahil@gmail.com' && password==='asdf'){
      return {
        "userId": "u123",
        "firstName": "Sahil",
        "email": "sahil@gmail.com",
        "password": "asdf"
      }
    }
    return null;
  }

  setCurrentUser(user: User){
    // this.currentUser=user;
  }

  getCurrentUser(): User | null{
    return this.currentUserSubject.value;
  }

  logout(){
    this.currentUserSubject.next(null);
  }
}
