import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeSidebarComponent } from '../employee-sidebar/employee-sidebar';

interface Notification {
  id: string;
  message: string;
  taskName: string;
  projectName?: string;
  managerName: string;
  timestamp: Date;
  isRead: boolean;
  type: 'task-assigned' | 'task-updated' | 'task-completed' | 'general';
}

@Component({
  selector: 'app-employee-notifications',
  standalone: true,
  imports: [CommonModule, EmployeeSidebarComponent],
  templateUrl: './employee-notifications.html',
  styleUrls: ['./employee-notifications.css']
})
export class EmployeeNotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  paginatedNotifications: Notification[] = [];

  isLoading = true;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor() { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading = true;

    // Simulate API call - Mock data directly in component
    this.notifications = this.getMockNotifications();
    this.updatePagination();
    this.isLoading = false;
  }

  getMockNotifications(): Notification[] {
    const now = new Date();

    return [
      {
        id: 'not-1',
        message: 'You have been assigned a new task for the Website Redesign project.',
        taskName: 'Homepage UI Design',
        projectName: 'Website Redesign',
        managerName: 'John Smith',
        timestamp: new Date(now.getTime() - 30 * 60000),
        isRead: false,
        type: 'task-assigned'
      },
      {
        id: 'not-2',
        message: 'Task deadline has been updated. Please review the new timeline.',
        taskName: 'Database Migration',
        projectName: 'System Upgrade',
        managerName: 'Sarah Johnson',
        timestamp: new Date(now.getTime() - 2 * 60 * 60000),
        isRead: false,
        type: 'task-updated'
      },
      {
        id: 'not-3',
        message: 'Your completed task has been reviewed and approved.',
        taskName: 'API Documentation',
        projectName: 'Backend Development',
        managerName: 'Michael Chen',
        timestamp: new Date(now.getTime() - 5 * 60 * 60000),
        isRead: false,
        type: 'task-completed'
      },
      {
        id: 'not-4',
        message: 'New task assigned: Implement user authentication module.',
        taskName: 'User Authentication',
        projectName: 'Security Enhancement',
        managerName: 'John Smith',
        timestamp: new Date(now.getTime() - 24 * 60 * 60000),
        isRead: false,
        type: 'task-assigned'
      },
      {
        id: 'not-5',
        message: 'Task priority has been changed to High. Please prioritize this work.',
        taskName: 'Bug Fix - Payment Gateway',
        projectName: 'Critical Fixes',
        managerName: 'Sarah Johnson',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60000),
        isRead: false,
        type: 'task-updated'
      },
      {
        id: 'not-6',
        message: 'Great job! Your task has been marked as completed.',
        taskName: 'Mobile Responsive Design',
        projectName: 'Website Redesign',
        managerName: 'Michael Chen',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60000),
        isRead: false,
        type: 'task-completed'
      },
      {
        id: 'not-7',
        message: 'You have been assigned to collaborate on a new feature implementation.',
        taskName: 'Shopping Cart Module',
        projectName: 'E-commerce Platform',
        managerName: 'John Smith',
        timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60000),
        isRead: false,
        type: 'task-assigned'
      },
      {
        id: 'not-8',
        message: 'Task description and requirements have been updated.',
        taskName: 'Performance Optimization',
        projectName: 'System Upgrade',
        managerName: 'Sarah Johnson',
        timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60000),
        isRead: false,
        type: 'task-updated'
      },
      {
        id: 'not-9',
        message: 'New urgent task: Fix critical production issue.',
        taskName: 'Production Hotfix',
        projectName: 'Critical Fixes',
        managerName: 'Michael Chen',
        timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60000),
        isRead: false,
        type: 'task-assigned'
      },
      {
        id: 'not-10',
        message: 'Your task submission has been reviewed. Please check feedback.',
        taskName: 'Code Review Changes',
        projectName: 'Backend Development',
        managerName: 'John Smith',
        timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60000),
        isRead: false,
        type: 'task-updated'
      },
      {
        id: 'not-11',
        message: 'Congratulations! Your task has been successfully completed.',
        taskName: 'Testing & QA',
        projectName: 'Quality Assurance',
        managerName: 'Sarah Johnson',
        timestamp: new Date(now.getTime() - 8 * 24 * 60 * 60000),
        isRead: false,
        type: 'task-completed'
      },
      {
        id: 'not-12',
        message: 'You have been assigned a new research task.',
        taskName: 'Technology Research',
        projectName: 'Innovation Lab',
        managerName: 'Michael Chen',
        timestamp: new Date(now.getTime() - 9 * 24 * 60 * 60000),
        isRead: false,
        type: 'task-assigned'
      }
    ];
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.notifications.length / this.itemsPerPage);
    this.updatePaginatedNotifications();
  }

  updatePaginatedNotifications(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedNotifications = this.notifications.slice(startIndex, endIndex);
  }

  markAsRead(notification: Notification, event: Event): void {
    event.stopPropagation();
    const index = this.notifications.findIndex(n => n.id === notification.id);
    if (index > -1) {
      this.notifications.splice(index, 1);

      // Adjust current page if necessary
      if (this.paginatedNotifications.length === 1 && this.currentPage > 1) {
        this.currentPage--;
      }

      this.updatePagination();
      // TODO: Call API to mark as read
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'task-assigned': return 'fa-plus-circle';
      case 'task-updated': return 'fa-edit';
      case 'task-completed': return 'fa-check-circle';
      default: return 'fa-bell';
    }
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case 'task-assigned': return 'notification-assigned';
      case 'task-updated': return 'notification-updated';
      case 'task-completed': return 'notification-completed';
      default: return 'notification-general';
    }
  }

  getUnreadCount(): number {
    return this.notifications.length;
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedNotifications();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedNotifications();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedNotifications();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(this.currentPage - 1);
        pages.push(this.currentPage);
        pages.push(this.currentPage + 1);
        pages.push(this.totalPages);
      }
    }

    return pages;
  }
}