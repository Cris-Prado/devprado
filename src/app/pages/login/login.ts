import { Component } from '@angular/core';
import { LoginForms } from '../../layouts/login-forms/login-forms';
import { InputLabel } from '../../compoents/input-label/input-label';
import { Icon } from '../../compoents/icon/icon';

@Component({
  selector: 'app-login',
  imports: [LoginForms, InputLabel, Icon],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {}
