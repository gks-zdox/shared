import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'fileSize'})
export class FileSizePipe implements PipeTransform {
   transform(n: number): string {
      if (isNaN(n)) { return 'n/a'; }
      if (n < 1024) { return this.getByte(n); }
      if (n < 1048576) { return `${this.toFixed(n / 1024, 1)} KB`; }
      if (n < 1073741824) { return `${this.toFixed(n / 1048576, 2)} MB`; }
      return `${this.toFixed(n / 1073741824, 2)} GB`;
   }

   private getByte(n: number): string {
      return `${n} ${n < 2 ? 'byte' : 'bytes'}`;
   }

   private toFixed(n: number, fractionDigits: number): string {
      let s = n.toFixed(fractionDigits);
      while (s.length > 0 && s.charAt(s.length - 1) === '0') {
         s = s.slice(0, -1);
      }
      if (s.length > 0 && s.charAt(s.length - 1) === '.') {
         s = s.slice(0, -1);
      }
      return s;
   }
}
