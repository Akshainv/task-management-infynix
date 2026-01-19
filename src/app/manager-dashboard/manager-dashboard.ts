import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ManagerSidebarComponent } from '../manager-sidebar/manager-sidebar';

interface SummaryCard {
  title: string;
  value: number;
  icon: string;
  bgColor: string;
  accentColor: string;
  iconBg: string;
  route: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
}

interface ActivityItem {
  id: number;
  title: string;
  timestamp: string;
  type: 'completed' | 'new' | 'warning';
  icon: string;
  color: string;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, ManagerSidebarComponent],
  templateUrl: './manager-dashboard.html',
  styleUrls: ['./manager-dashboard.css']
})
export class ManagerDashboardComponent implements OnInit {

  summaryCards: SummaryCard[] = [
    {
      title: 'Ongoing Projects',
      value: 12,
      icon: 'fa-project-diagram',
      bgColor: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
      accentColor: '#3B82F6',
      iconBg: 'rgba(59, 130, 246, 0.15)',
      route: '/manager/projects',
      trend: '12% from last month',
      trendDirection: 'up'
    },
    {
      title: 'Completed Projects',
      value: 35,
      icon: 'fa-check-circle',
      bgColor: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
      accentColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      route: '/manager/projects',
      trend: '8% from last month',
      trendDirection: 'up'
    },
    {
      title: 'Pending Tasks',
      value: 15,
      icon: 'fa-clock',
      bgColor: 'linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)',
      accentColor: '#F97316',
      iconBg: 'rgba(249, 115, 22, 0.15)',
      route: '/manager/projects',
      trend: '3% from last week',
      trendDirection: 'down'
    },
    {
      title: 'Team Members',
      value: 48,
      icon: 'fa-users',
      bgColor: 'linear-gradient(135deg, #E9D5FF 0%, #D8B4FE 100%)',
      accentColor: '#8B5CF6',
      iconBg: 'rgba(139, 92, 246, 0.15)',
      route: '/manager/team',
      trend: 'No change',
      trendDirection: 'neutral'
    }
  ];

  recentActivities: ActivityItem[] = [
    {
      id: 1,
      title: 'Project "Mobile App" completed',
      timestamp: '2 hours ago',
      type: 'completed',
      icon: 'fa-check',
      color: '#10B981'
    },
    {
      id: 2,
      title: 'New team member added: Sarah Johnson',
      timestamp: '5 hours ago',
      type: 'new',
      icon: 'fa-user-plus',
      color: '#3B82F6'
    },
    {
      id: 3,
      title: 'Deadline approaching for "Website Redesign"',
      timestamp: '1 day ago',
      type: 'warning',
      icon: 'fa-exclamation-triangle',
      color: '#F97316'
    },
    {
      id: 4,
      title: 'Project "E-commerce Platform" started',
      timestamp: '2 days ago',
      type: 'new',
      icon: 'fa-rocket',
      color: '#3B82F6'
    },
    {
      id: 5,
      title: 'Weekly team meeting scheduled',
      timestamp: '3 days ago',
      type: 'new',
      icon: 'fa-calendar',
      color: '#8B5CF6'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  onCardClick(route: string): void {
    this.router.navigate([route]);
  }

  onActivityClick(activity: ActivityItem): void {
    console.log('Activity clicked:', activity);
  }

  refreshDashboard(): void {
    console.log('Refreshing dashboard...');
  }

  getTrendIcon(direction: string): string {
    switch (direction) {
      case 'up':
        return 'fa-arrow-up';
      case 'down':
        return 'fa-arrow-down';
      default:
        return 'fa-minus';
    }
  }

  getTrendClass(direction: string): string {
    switch (direction) {
      case 'up':
        return 'trend-up';
      case 'down':
        return 'trend-down';
      default:
        return 'trend-neutral';
    }
  }

  getActivityIconClass(type: string): string {
    return `activity-icon-${type}`;
  }
}