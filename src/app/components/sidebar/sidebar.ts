import { Component, ElementRef, EventEmitter, inject, Input, Output, signal, viewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() open = false;

  @Output() closeMenu = new EventEmitter<void>();

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');

  protected readonly loggingOut = signal(false);
  protected readonly logoutError = signal('');

  focusCloseButton(): void {
    this.closeButton().nativeElement.focus();
  }

  protected async logout(): Promise<void> {
    if (this.loggingOut()) return;

    this.loggingOut.set(true);
    this.logoutError.set('');

    try {
      await this.auth.logout();
      await this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch {
      this.logoutError.set('Não foi possível sair da conta. Tente novamente.');
    } finally {
      this.loggingOut.set(false);
    }
  }
}
