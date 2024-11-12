import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements AfterViewInit {
  @Input() message: string = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();
  @ViewChild('toastTrigger') myButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('modal') modalElement!: ElementRef;

  ngAfterViewInit(): void {
    const modal = new bootstrap.Modal(this.modalElement.nativeElement);
    modal.show();
  }

  confirm() {
    this.confirmed.emit(true);
    this.close();
  }

  close() {
    const modal = bootstrap.Modal.getInstance(this.modalElement.nativeElement);
    modal.hide();
    this.confirmed.emit(false);
  }
}
