import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hilight' })
export class HilightPipe implements PipeTransform {
   transform(s: any, t?: string, exact = false): string {
      if (!t || t.length === 0) {
         return s ? this.escape(s.toString()) : s;
      }
      if (!s || s.length === 0) {
         return s;
      }
      s = this.escape(s.toString());
      t = this.escape(t.toLowerCase());
      const a: string = s.toLowerCase();
      if (exact) {
         return a === t ? `<em>${s}</em>` : s;
      }
      let start = 0;
      let x = 0;
      while (start < a.length) {
         const i = a.indexOf(t, start);
         if (i === -1) {
            break;
         }
         x += i - start;
         s = s.substring(0, x) + `<em>${s.substr(x, t.length)}</em>` + s.substr(x + t.length);
         start = i + t.length;
         x += t.length + 9;
      }
      return s;
   }

   private escape(s: string): string {
      const p = document.createElement('p');
      p.appendChild(document.createTextNode(s));
      return p.innerHTML;
   }
}
