import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const MASKED_INPUT_ACCESSOR: any = {
   provide: NG_VALUE_ACCESSOR,
   useExisting: forwardRef(() => MaskedInputComponent),
   multi: true
};

@Component({
   selector: 'app-masked-input',
   templateUrl: './masked-input.html',
   styleUrls: ['./masked-input.scss'],
   providers: [MASKED_INPUT_ACCESSOR]
})
export class MaskedInputComponent implements ControlValueAccessor {
   @HostBinding('class') className = 'app-masked-input';
   @ViewChild('input') input!: ElementRef;
   @Input() disabled = false;
   @Input() required: boolean | string = false;
   @Input() minlength: string | number = 1;
   @Input() maxlength: string | number = 255;
   @Input() pattern = '';
   @Input() placeholder = '';
   @Input() readonly = false;
   @Output() next = new EventEmitter<any>();
   visible = false;
   private currentValue = '';

   constructor(private elementRef: ElementRef) {
      if (this.elementRef.nativeElement.hasAttribute('disabled')) {
         this.disabled = true;
      }
      if (this.elementRef.nativeElement.hasAttribute('required')) {
         this.required = true;
      }
   }

   onChange: (_: any) => void = (_: any) => { };
   onTouched: () => void = () => { };

   get value(): string {
      return this.currentValue;
   }

   set value(value: string) {
      if (this.currentValue !== value) {
         this.currentValue = value;
         this.onChange(value);
      }
   }

   writeValue(value: string): void {
      if (this.currentValue !== value) {
         this.currentValue = value;
      }
   }

   registerOnChange(fn: any): void {
      this.onChange = fn;
   }

   registerOnTouched(fn: any): void {
      this.onTouched = fn;
   }

   setDisabledState?(isDisabled: boolean): void {
      this.input.nativeElement.disabled = isDisabled;
   }

   onKeypress(e: KeyboardEvent): void {
      if (e.key === 'Enter' && this.currentValue && this.currentValue.length) {
         this.next.emit();
      }
   }

   focus(): void {
      this.input.nativeElement.focus();
   }

   select(): void {
      this.input.nativeElement.select();
   }
}
