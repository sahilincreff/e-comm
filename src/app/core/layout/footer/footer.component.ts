import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentTime: string = '';
  private timeInterval: any;

  ngOnInit(): void {
    this.updateTime(); 
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval); 
    }
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toUTCString();
  }
}
