import { Component } from '@angular/core';
import { LoginForms } from '../../layouts/login-forms/login-forms';
import { InputLabel } from '../../compoents/input-label/input-label';
import { Icon } from '../../compoents/icon/icon';

@Component({
  selector: 'app-register',
  imports: [LoginForms, Icon, InputLabel],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register { }
