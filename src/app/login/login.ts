// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  email: string;
  password: string;
  role: string;
  name: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  selectedRole: string = 'admin';
  errorMessage: string = '';
  isLoading: boolean = false;
  showError: boolean = false;

  // Role options for dropdown
  roles = [
    { value: 'admin', label: 'Admin', icon: '👑' },
    { value: 'manager', label: 'Manager', icon: '👔' },
    { value: 'employee', label: 'Employee', icon: '👤' }
  ];

  constructor(private router: Router) {}

  onSubmit(): void {
    // Reset error state
    this.errorMessage = '';
    this.showError = false;

    // Validate fields
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in email and password';
      this.showError = true;
      this.triggerShake();
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.showError = true;
      this.triggerShake();
      return;
    }

    // Show loading state
    this.isLoading = true;

    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // Store user info in localStorage
        const userInfo = {
          email: this.email,
          role: this.selectedRole,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('isLoggedIn', 'true');

        // Navigate based on role
        this.navigateBasedOnRole();
      } catch (error) {
        console.error('Login error:', error);
        this.errorMessage = 'An error occurred during login';
        this.showError = true;
        this.isLoading = false;
      }
    }, 800); // Simulate network delay
  }

  private navigateBasedOnRole(): void {
    // Navigate to appropriate dashboard based on role
    switch (this.selectedRole) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']).then(success => {
          if (success) {
            console.log('Navigation to admin dashboard successful');
          } else {
            console.error('Navigation to admin dashboard failed');
            this.handleNavigationError();
          }
        });
        break;
      case 'manager':
        // Navigate to manager dashboard (can be implemented later)
        this.router.navigate(['/admin/dashboard']).then(success => {
          if (success) {
            console.log('Navigation to manager dashboard successful');
          } else {
            this.handleNavigationError();
          }
        });
        break;
      case 'employee':
        // Navigate to employee dashboard
        this.router.navigate(['/employee/dashboard']).then(success => {
          if (success) {
            console.log('Navigation to employee dashboard successful');
          } else {
            console.error('Navigation to employee dashboard failed');
            this.handleNavigationError();
          }
        });
        break;
      default:
        this.router.navigate(['/admin/dashboard']);
    }
  }

  private handleNavigationError(): void {
    this.errorMessage = 'Navigation failed. Please try again.';
    this.showError = true;
    this.isLoading = false;
  }

  private triggerShake(): void {
    const formSection = document.querySelector('.form-section');
    if (formSection) {
      formSection.classList.add('shake');
      setTimeout(() => {
        formSection.classList.remove('shake');
      }, 500);
    }
  }

  getSelectedRoleIcon(): string {
    const role = this.roles.find(r => r.value === this.selectedRole);
    return role ? role.icon : '👤';
  }

  // Optional: Method to clear form
  clearForm(): void {
    this.email = '';
    this.password = '';
    this.selectedRole = 'admin';
    this.errorMessage = '';
    this.showError = false;
  }
}