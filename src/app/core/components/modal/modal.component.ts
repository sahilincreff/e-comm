import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() message: string = 'Are you sure?';
  @Output() confirmed = new EventEmitter<boolean>();
  
  confirm() {
    this.confirmed.emit(true);
    this.close();
  }

  close() {
    this.confirmed.emit(false);
  }
}
