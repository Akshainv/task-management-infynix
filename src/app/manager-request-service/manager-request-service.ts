import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerSidebarComponent } from '../manager-sidebar/manager-sidebar';

interface ServiceRequest {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  status: 'sent';
}

@Component({
  selector: 'app-manager-request-service',
  standalone: true,
  imports: [CommonModule, FormsModule, ManagerSidebarComponent],
  templateUrl: './manager-request-service.html',
  styleUrls: ['./manager-request-service.css']
})
export class ManagerRequestServiceComponent {
  // Form fields
  requestType: 'info' | 'warning' | 'error' | 'success' = 'info';
  requestMessage: string = '';

  // Error handling
  showError: boolean = false;
  errorMessage: string = '';

  // Sent requests history
  sentRequests: ServiceRequest[] = [];

  // Counter for request IDs
  private nextId: number = 1;



  // Get type label
  getTypeLabel(type: string): string {
    switch (type) {
      case 'info':
        return 'Information';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Critical Issue';
      case 'success':
        return 'Feedback';
      default:
        return 'General';
    }
  }

  // Get type description
  getTypeDescription(type: string): string {
    switch (type) {
      case 'info':
        return 'General information or inquiry';
      case 'warning':
        return 'Important matter requiring attention';
      case 'error':
        return 'Urgent issue that needs immediate action';
      case 'success':
        return 'Positive feedback or success report';
      default:
        return 'General request';
    }
  }

  // Get icon based on request type
  getRequestIcon(type: string): string {
    switch (type) {
      case 'info':
        return 'fa-info-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-times-circle';
      default:
        return 'fa-clipboard-list';
    }
  }

  // Send request
  sendRequest(): void {
    // Validate message
    if (!this.requestMessage.trim()) {
      this.showError = true;
      this.errorMessage = 'Please enter a message before sending the request.';
      setTimeout(() => {
        this.showError = false;
      }, 3000);
      return;
    }

    // Create new request
    const newRequest: ServiceRequest = {
      id: this.nextId++,
      type: this.requestType,
      message: this.requestMessage.trim(),
      timestamp: this.getFormattedTimestamp(),
      status: 'sent'
    };

    // Add to sent requests (newest first)
    this.sentRequests.unshift(newRequest);

    // Reset form
    this.resetForm();

    // Show success message (optional)
    console.log('Service request sent successfully:', newRequest);
  }

  // Reset form
  resetForm(): void {
    this.requestType = 'info';
    this.requestMessage = '';
    this.showError = false;
    this.errorMessage = '';
  }

  // Delete individual request
  deleteRequest(id: number): void {
    const index = this.sentRequests.findIndex(r => r.id === id);
    if (index !== -1) {
      if (confirm('Are you sure you want to delete this request?')) {
        this.sentRequests.splice(index, 1);
      }
    }
  }

  // Clear all requests
  clearAllRequests(): void {
    if (this.sentRequests.length === 0) {
      return;
    }

    if (confirm('Are you sure you want to clear all request history? This action cannot be undone.')) {
      this.sentRequests = [];
    }
  }

  // Get formatted timestamp
  private getFormattedTimestamp(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();

    return `${day}/${month}/${year} at ${hours}:${minutes}`;
  }
}