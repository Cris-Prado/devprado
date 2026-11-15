import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input-label',
  imports: [],
  templateUrl: './input-label.html',
  styleUrl: './input-label.css',
})

export class InputLabel {
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type: string = '';
  @Input() placeholder: string = '';
}
