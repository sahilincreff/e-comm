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
  toasts: Toast[] = [];  // Array to hold all toast objects
  @ViewChild('toastTrigger') toastButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('toastElement') toastElement!: ElementRef;  // Reference to the toast container

  // Injecting the ToastService
  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    // Subscribe to the observable from the ToastService
    this.toastService.getToasts().subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngAfterViewInit(): void {
    // Initialize bootstrap Toast after the view has initialized
    this.toasts.forEach((toast, index) => {
      const toastElement = this.toastElement.nativeElement.children[index];
      const bootstrapToast = new bootstrap.Toast(toastElement);
      bootstrapToast.show(); // Show the toast programmatically
    });
  }

  // Method to remove the toast at a given index
  removeToast(i: number): void {
    this.toasts.splice(i, 1);
  }
}
