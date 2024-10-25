import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from 'src/app/shared/models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersApiUrl = 'assets/constants/users.json';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  validateUser(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.usersApiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        return user || null;
      }),
      catchError(error => {
        console.error('Error validating user:', error);
        return [null]; // Return null in case of error
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
    console.log('Current User:', this.currentUserSubject.value);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout() {
    this.currentUserSubject.next(null);
    console.log('User logged out:', this.currentUserSubject.value);
  }
}
