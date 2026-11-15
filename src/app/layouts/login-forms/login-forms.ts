import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-forms',
  imports: [RouterLink],
  templateUrl: './login-forms.html',
  styleUrl: './login-forms.css',
})
export class LoginForms {
  @Input() title: string = '';
  @Input() descriptionPage: string = '';
  @Input() subtitle: string = '';
  @Input() subDescriptionPage: string = '';
  @Input() btnNavigation = '';
  @Input() navigationLink = '/';
}
