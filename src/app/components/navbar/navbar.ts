import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() userName = 'Cristiano Prado';
  @Input() initials = 'CP';
  @Input() menuOpen = false;

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  submitSearch(event: Event, value: string): void {
    event.preventDefault();
    this.search.emit(value.trim());
  }
}
