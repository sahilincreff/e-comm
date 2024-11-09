import { Component } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Toast } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(i:number){
    this.toasts.slice(i,1);
  }
}
