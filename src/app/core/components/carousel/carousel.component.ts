import { Component, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnDestroy, OnChanges {
  @Input() slideImages: string[] = [];

  selectedSlide = 0;
  currImage = '';
  showMoreImages = true;
  imageChangeInterval: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['slideImages'] && this.slideImages.length > 0) {
      this.selectedSlide = 0; 
      this.currImage = this.slideImages[this.selectedSlide];
      this.startImageChange();
    }
  }

  onNext() {
    this.selectedSlide = (this.selectedSlide + 1) % this.slideImages.length;
    this.currImage = this.slideImages[this.selectedSlide];
  }

  onPrev() {
    this.selectedSlide = (this.selectedSlide - 1 + this.slideImages.length) % this.slideImages.length;
    this.currImage = this.slideImages[this.selectedSlide];
  }

  startImageChange() {
    if (!this.imageChangeInterval) {
      this.imageChangeInterval = setInterval(() => {
        this.onNext();
      }, 2000);
    }
  }

  stopImageChange() {
    if (this.imageChangeInterval) {
      clearInterval(this.imageChangeInterval);
      this.imageChangeInterval = null;
    }
  }

  selectSlide(index: number) {
    this.selectedSlide = index;
    this.currImage = this.slideImages[index];
  }

  ngOnDestroy() {
    this.stopImageChange();
  }
}
