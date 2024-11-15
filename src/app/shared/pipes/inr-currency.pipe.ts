import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency'
})
export class IndianCurrencyPipe implements PipeTransform {

  transform(value: any, currencySymbol: string = '₹'): string {
    if (value == null || isNaN(value)) return '';
    let amount = value.toString();
    let [integer, decimal] = amount.split('.');
    let lastThree = integer.substring(integer.length - 3);
    let otherNumbers = integer.substring(0, integer.length - 3);
    if (otherNumbers != '') lastThree = ',' + lastThree;
    let formattedInteger = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    let formattedDecimal = decimal ? '.' + decimal.substring(0, 2) : '';
    return currencySymbol + formattedInteger + formattedDecimal;
  }
}
