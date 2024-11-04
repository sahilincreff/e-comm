import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import User from 'src/app/shared/models/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersApiUrl = 'assets/constants/users.json';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      this.getUserById(userId).subscribe(user => {
        this.setCurrentUser(user);
      });
    }
  }

  private getUserById(userId: string): Observable<User | null> {
    return this.http.get<User[]>(this.usersApiUrl).pipe(
      map(users => users.find(u => u.userId === userId) || null),
      catchError(error => {
        console.error('Error fetching user by ID:', error);
        return of(null);
      })
    );
  }

  validateUser(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(this.usersApiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password) || null;
        if (user) {
          localStorage.setItem('currentUserId', user.userId);
          this.setCurrentUser(user);
        }
        return user;
      }),
      catchError(error => {
        console.error('Error validating user:', error);
        return of(null);
      })
    );
  }
  

  setCurrentUser(user: User | null): void {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    localStorage.removeItem('currentUserId');
    this.setCurrentUser(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUserId');
  }
}
