// admin-sidebar.component.ts
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-sidebar.html',
  styleUrls: ['./admin-sidebar.css']
})
export class AdminSidebarComponent implements OnInit, OnDestroy {
  @ViewChild('sidebarElement', { static: true }) sidebarElement!: ElementRef;

  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isOverlayActive = false;
  currentRoute = '';
  
  private routerSubscription?: Subscription;
  private resizeTimeout: any;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        if (this.isMobileMenuOpen) {
          this.closeMobileMenu();
        }
      });

    this.loadSidebarState();
    this.setupEventListeners();
    this.checkScreenSize();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.removeEventListeners();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.checkScreenSize();
    }, 150);
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  private removeEventListeners(): void {
    // Cleanup if needed
  }

  private checkScreenSize(): void {
    const width = window.innerWidth;
    
    if (width > 1024) {
      this.closeMobileMenu();
      if (this.isSidebarCollapsed) {
        this.renderer.addClass(this.sidebarElement.nativeElement, 'collapsed');
      }
    } else {
      this.renderer.removeClass(this.sidebarElement.nativeElement, 'collapsed');
    }
  }

  toggleSidebarCollapse(): void {
    if (window.innerWidth > 1024) {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      if (this.isSidebarCollapsed) {
        this.renderer.addClass(this.sidebarElement.nativeElement, 'collapsed');
      } else {
        this.renderer.removeClass(this.sidebarElement.nativeElement, 'collapsed');
      }
      this.saveSidebarState();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.openMobileMenu();
    } else {
      this.closeMobileMenu();
    }
  }

  openMobileMenu(): void {
    this.isMobileMenuOpen = true;
    this.isOverlayActive = true;
    
    this.renderer.addClass(this.sidebarElement.nativeElement, 'mobile-open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
      this.renderer.addClass(overlay, 'active');
    }
    this.renderer.addClass(document.body, 'menu-open');
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.isOverlayActive = false;
    
    this.renderer.removeClass(this.sidebarElement.nativeElement, 'mobile-open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
      this.renderer.removeClass(overlay, 'active');
    }
    this.renderer.removeClass(document.body, 'menu-open');
  }

  navigateToNotifications(): void {
    this.router.navigate(['/admin/notifications']);
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  logout(): void {
    console.log('Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('sidebarCollapsed');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  private saveSidebarState(): void {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(this.isSidebarCollapsed));
  }

  private loadSidebarState(): void {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      this.isSidebarCollapsed = JSON.parse(savedState);
      if (window.innerWidth > 1024 && this.isSidebarCollapsed) {
        this.renderer.addClass(this.sidebarElement.nativeElement, 'collapsed');
      }
    }
  }

  isRouteActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }
}