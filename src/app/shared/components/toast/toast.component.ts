import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnChanges, OnDestroy {
  @Input() message: string = ''; // The message to display
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info'; // Toast type
  @Input() time: number = 3; // Time in seconds to display the toast

  showToast: boolean = false; // Flag to control the visibility of the toast
  private toastTimer: any;

  ngOnInit(): void {
    if (this.message) {
      this.showToast = true;
      this.autoHideToast();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && this.message) {
      this.showToast = true;
      this.autoHideToast();
    }
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  private autoHideToast(): void {
    if (this.time > 0) {
      this.toastTimer = setTimeout(() => {
        this.showToast = false;
      }, this.time * 1000); // Hide after the specified time in seconds
    }
  }
}
