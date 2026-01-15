import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

interface ServiceRequest {
  id: number;
  managerName: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

@Component({
  selector: 'app-admin-service-requests',
  standalone: true,
  imports: [CommonModule,AdminSidebarComponent],
  templateUrl: './admin-service-requests.html',
  styleUrls: ['./admin-service-requests.css']
})
export class AdminServiceRequestsComponent {
  serviceRequests: ServiceRequest[] = [
    {
      id: 1,
      managerName: 'John Smith',
      message: 'Request for new laptop for development team member',
      timestamp: '2 minutes ago',
      type: 'info'
    },
    {
      id: 2,
      managerName: 'Sarah Johnson',
      message: 'Urgent: Office printer maintenance required',
      timestamp: '15 minutes ago',
      type: 'warning'
    },
    {
      id: 3,
      managerName: 'Michael Brown',
      message: 'Request to schedule team building event for next month',
      timestamp: '1 hour ago',
      type: 'info'
    },
    {
      id: 4,
      managerName: 'David Anderson',
      message: 'Additional parking space needed for new employees',
      timestamp: '2 hours ago',
      type: 'info'
    },
    {
      id: 5,
      managerName: 'Emily Davis',
      message: 'Conference room booking system not working properly',
      timestamp: '3 hours ago',
      type: 'error'
    },
    {
      id: 6,
      managerName: 'Robert Wilson',
      message: 'Request for software license renewal - Project Management Tool',
      timestamp: '5 hours ago',
      type: 'warning'
    },
    {
      id: 7,
      managerName: 'Jennifer Martinez',
      message: 'Need approval for remote work equipment for team',
      timestamp: '1 day ago',
      type: 'info'
    },
    {
      id: 8,
      managerName: 'Thomas Garcia',
      message: 'Request for additional storage space on cloud server',
      timestamp: '2 days ago',
      type: 'info'
    }
  ];

  // Get total service requests count
  get totalRequests(): number {
    return this.serviceRequests.length;
  }

  // Mark request as read (delete it)
  markAsRead(id: number): void {
    const index = this.serviceRequests.findIndex(r => r.id === id);
    if (index !== -1) {
      this.serviceRequests.splice(index, 1);
    }
  }

  // Delete all service requests
  deleteAll(): void {
    if (confirm('Are you sure you want to mark all service requests as read? This will remove all requests from the list.')) {
      this.serviceRequests = [];
    }
  }

  // Get icon based on request type
  getRequestIcon(type: string): string {
    switch(type) {
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
}