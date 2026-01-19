import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-manager-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manager-sidebar.html',
  styleUrls: ['./manager-sidebar.css']
})
export class ManagerSidebarComponent {
  // Sidebar state
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isOverlayActive = false;

  menuItems: MenuItem[] = [
    {
      icon: 'fa-tachometer-alt',
      label: 'Dashboard',
      route: '/manager/dashboard'
    },
    {
      icon: 'fa-project-diagram',
      label: 'Projects',
      route: '/manager/projects'
    },
    {
      icon: 'fa-users',
      label: 'My Team',
      route: '/manager/team'
    },
    {
      icon: 'fa-paper-plane',
      label: 'Request Service',
      route: '/manager/request-service'
    },
    {
      icon: 'fa-bell',
      label: 'Notifications',
      route: '/manager/notifications',
      badge: 5
    }
  ];

  constructor(private router: Router) {}

  // Toggle sidebar collapse (for desktop)
  toggleSidebarCollapse(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isOverlayActive = !this.isOverlayActive;
  }

  // Close mobile menu
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.isOverlayActive = false;
  }

  // Navigate to notifications
  navigateToNotifications(): void {
    this.router.navigate(['/manager/notifications']);
    this.closeMobileMenu();
  }

  // Navigate to a specific route
  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.closeMobileMenu();
  }

  // Check if route is active
  isActive(route: string): boolean {
    return this.router.url === route;
  }

  // Logout functionality
  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.router.navigate(['/login']);
    }
  }
}