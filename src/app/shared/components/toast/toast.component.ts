import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() toastTitle: string = '';
  @Input() toastMessage: string = '';
  @Input() toastClass: string = 'bg-success'; 
  @Input() duration: number = 3000;
  @Output() toastClosed = new EventEmitter<void>();

  showToast: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.showToast = true; 
    this.autoCloseToast();
  }

  ngOnDestroy(): void {
    this.showToast = false;
  }

  closeToast(): void {
    this.showToast = false;
    this.toastClosed.emit();
  }

  private autoCloseToast(): void {
    setTimeout(() => {
      this.closeToast();
    }, this.duration);
  }
}
