// admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

interface SummaryCard {
  title: string;
  value: number;
  icon: string;
  bgColor: string;
  accentColor: string;
  iconBg: string;
  route: string;
}

interface ServiceRequest {
  id: number;
  managerName: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'resolved';
  icon: string;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  summaryCards: SummaryCard[] = [
    {
      title: 'Total Employees',
      value: 245,
      icon: 'fa-users',
      bgColor: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
      accentColor: '#0EA5E9',
      iconBg: 'rgba(14, 165, 233, 0.15)',
      route: '/admin/employees'
    },
    {
      title: 'Total Managers',
      value: 18,
      icon: 'fa-user-tie',
      bgColor: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
      accentColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      route: '/admin/managers'
    },
    {
      title: 'Total Projects',
      value: 42,
      icon: 'fa-folder-open',
      bgColor: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
      accentColor: '#F97316',
      iconBg: 'rgba(249, 115, 22, 0.15)',
      route: '/admin/project-overview'
    }
  ];

  recentServiceRequests: ServiceRequest[] = [
    {
      id: 1,
      managerName: 'Sarah Johnson',
      message: 'Request for additional software licenses for the development team',
      timestamp: '5 minutes ago',
      priority: 'high',
      status: 'pending',
      icon: 'fa-laptop',
      color: '#EF4444'
    },
    {
      id: 2,
      managerName: 'Michael Chen',
      message: 'Need approval for cloud infrastructure upgrade for Q2 projects',
      timestamp: '20 minutes ago',
      priority: 'high',
      status: 'in-progress',
      icon: 'fa-cloud',
      color: '#F59E0B'
    },
    {
      id: 3,
      managerName: 'Emma Davis',
      message: 'Requesting budget allocation for employee training programs',
      timestamp: '1 hour ago',
      priority: 'medium',
      status: 'pending',
      icon: 'fa-graduation-cap',
      color: '#0EA5E9'
    },
    {
      id: 4,
      managerName: 'Robert Williams',
      message: 'Hardware replacement needed for data analytics team workstations',
      timestamp: '2 hours ago',
      priority: 'medium',
      status: 'in-progress',
      icon: 'fa-desktop',
      color: '#10B981'
    },
    {
      id: 5,
      managerName: 'Jennifer Lopez',
      message: 'Access permissions required for new security audit tools',
      timestamp: '3 hours ago',
      priority: 'high',
      status: 'pending',
      icon: 'fa-shield-alt',
      color: '#EF4444'
    },
    {
      id: 6,
      managerName: 'Daniel Garcia',
      message: 'Office space reorganization request for marketing team expansion',
      timestamp: '4 hours ago',
      priority: 'low',
      status: 'resolved',
      icon: 'fa-building',
      color: '#6B7280'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    console.log('Dashboard data loaded');
  }

  onCardClick(route: string): void {
    this.router.navigate([route]);
  }

  onServiceRequestClick(request: ServiceRequest): void {
    console.log('Service request clicked:', request);
    // Handle service request click - show details modal or navigate
  }

  refreshDashboard(): void {
    console.log('Refreshing dashboard...');
    this.loadDashboardData();
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-in-progress';
      case 'resolved':
        return 'status-resolved';
      default:
        return '';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }
}