import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() userName = 'Cristiano Prado';
  @Input() initials = 'CP';
  @Input() menuOpen = false;

  @Output() toggleMenu = new EventEmitter<void>();
}
