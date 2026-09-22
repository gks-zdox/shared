import { Pipe, PipeTransform } from '@angular/core';

declare let numeral: any;

@Pipe({
    name: 'numeral',
    standalone: false
})
export class NumeralPipe implements PipeTransform {
   transform(value?: string | number, format?: string): string {
      if (value === undefined || value === null) {
         return '—';
      }
      return numeral(value).format(format || '0,0');
   }
}

@Pipe({
    name: 'money',
    standalone: false
})
export class MoneyPipe implements PipeTransform {
   transform(value: number | undefined): string {
      if (value === undefined || value === null) {
         return '—';
      }
      return numeral(value).format('0,0.00');
   }
}

@Pipe({
    name: 'decimal',
    standalone: false
})
export class DecimalPipe implements PipeTransform {
   transform(value: number | undefined): string {
      if (value === undefined || value === null) {
         return '—';
      }
      let s: string = numeral(value).format('0,0.00000');
      while (s.charAt(s.length - 1) === '0' || s.charAt(s.length - 1) === '.') {
         s = s.substr(0, s.length - 1);
      }
      return s;
   }
}
