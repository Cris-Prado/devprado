import { Component, ElementRef, EventEmitter, Input, Output, viewChild } from '@angular/core';
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

  @Output() openMenu = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  private readonly menuButton = viewChild.required<ElementRef<HTMLButtonElement>>('menuButton');

  focusMenuButton(): void {
    this.menuButton().nativeElement.focus();
  }

  submitSearch(event: Event, value: string): void {
    event.preventDefault();
    this.search.emit(value.trim());
  }
}
