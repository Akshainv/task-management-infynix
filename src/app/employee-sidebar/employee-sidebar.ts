import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-sidebar.html',
  styleUrls: ['./employee-sidebar.css']
})
export class EmployeeSidebarComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  isOverlayActive = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  toggleSidebarCollapse(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.isOverlayActive = this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.isOverlayActive = false;
  }

  logout(): void {
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');

    // Navigate to login page using Angular Router (no page refresh)
    this.router.navigate(['/login']);
  }
}