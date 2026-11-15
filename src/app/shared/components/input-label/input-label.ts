import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-label',
  templateUrl: './input-label.html',
  styleUrl: './input-label.css',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputLabel), multi: true },
  ],
})
export class InputLabel implements ControlValueAccessor {
  @Input() inputId = '';
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() autocomplete = '';
  value = '';
  disabled = false;
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};
  writeValue(value: string | null): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
  updateValue(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }
}
