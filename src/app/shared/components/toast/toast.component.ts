import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast/toast.service';
import { Toast } from 'src/app/services/toast/toast.service';

declare var bootstrap: any;

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements AfterViewInit {
  toasts: Toast[] = [];
  @ViewChild('toastTrigger') toastButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('toastElement') toastElement!: ElementRef;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngAfterViewInit(): void {
    this.toasts.forEach((toast, index) => {
      const toastElement = this.toastElement.nativeElement.children[index];
      const bootstrapToast = new bootstrap.Toast(toastElement);
      bootstrapToast.show();
    });
  }

  removeToast(i: number): void {
    this.toasts.splice(i, 1);
  }
}
