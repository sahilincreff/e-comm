import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastSubject = new BehaviorSubject<Toast[]>([]);

  constructor() { }

  getToasts() {
    return this.toastSubject.asObservable();
  }

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) {
    const toast: Toast = { message, type, duration };
    this.toasts.push(toast);
    this.toastSubject.next([...this.toasts]);

    setTimeout(() => {
      this.removeToast(toast);
    }, duration);
  }

  private removeToast(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
    this.toastSubject.next([...this.toasts]);
  }
}
