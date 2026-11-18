import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, HostListener, inject, Injector, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly sidebar = viewChild.required(Sidebar);
  private readonly navbar = viewChild.required(Navbar);

  sidebarOpen = false;

  openSidebar(): void {
    this.sidebarOpen = true;
    afterNextRender(() => this.sidebar().focusCloseButton(), { injector: this.injector });
  }

  closeSidebar(): void {
    if (!this.sidebarOpen) return;

    this.sidebarOpen = false;
    afterNextRender(() => this.navbar().focusMenuButton(), { injector: this.injector });
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.sidebarOpen && !this.document.defaultView?.matchMedia('(max-width: 768px)').matches) {
      this.sidebarOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeSidebar();
  }
}
