import { AuthService } from '../../core/services/auth';
import { Component, HostListener, inject, computed, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly logoutError = signal('');
  readonly userName = computed(
    () =>
      this.auth.user()?.user_metadata?.['full_name'] || this.auth.user()?.email || 'Minha conta',
  );
  readonly initials = computed(() => this.userName().slice(0, 2).toUpperCase());
  async logout(): Promise<void> {
    this.logoutError.set('');
    try {
      await this.auth.logout();
      await this.router.navigateByUrl('/login');
    } catch {
      this.logoutError.set('Não foi possível sair. Tente novamente.');
    }
  }
  sidebarOpen = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeSidebar();
  }
}
