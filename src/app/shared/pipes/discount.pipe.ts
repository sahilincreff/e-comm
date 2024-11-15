import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'discount'
})
export class DiscountPipe implements PipeTransform {
  transform(sellingPrice: number, mrp: number): string {
    if (!sellingPrice || !mrp || sellingPrice >= mrp) return '';
    const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
    return `${discountPercentage.toFixed(0)}% Off`;
  }
}
