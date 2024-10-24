import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent {
  // @Input() slideImages!: string[];
  slideImages=['https://media.croma.com/image/upload/v1710251223/Croma%20Assets/Communication/Mobiles/Images/305350_0_e6efve.png',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1710482971/Croma%20Assets/Communication/Mobiles/Images/305350_2_yyhgr9.png',
    'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1709735939/Croma%20Assets/Communication/Mobiles/Images/305350_16_vkscqy.png?tr=w-640']

  selectedSlide=0;
  currImage=this.slideImages[this.selectedSlide];
  showMoreImages=true;
  showNavigations=true;

  onNext(){
    this.selectedSlide++;
    if(this.selectedSlide>=this.slideImages.length){
      this.selectedSlide=0;
    }
    this.currImage=this.slideImages[this.selectedSlide];
  }

  onPrev(){
    this.selectedSlide--;
    if(this.selectedSlide<0){
      this.selectedSlide=this.slideImages.length-1;
    }
    this.currImage=this.slideImages[this.selectedSlide];
  }

  handleHover(){
    setInterval(()=>{
      this.selectedSlide++;
    }, 2000)
  }

  selectSlide(index: number){
    this.selectedSlide=index;
    this.currImage=this.slideImages[index];
  }
}
