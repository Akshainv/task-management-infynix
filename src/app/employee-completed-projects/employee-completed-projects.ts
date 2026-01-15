// employee-completed-projects.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeSidebarComponent } from '../employee-sidebar/employee-sidebar';

interface CompletedProject {
  id: number;
  name: string;
  description: string;
  location: string;
  clientNumber: string;
  deadline: string;
  completionDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Completed';
  colorTheme: string;
}

@Component({
  selector: 'app-employee-completed-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeSidebarComponent],
  templateUrl: './employee-completed-projects.html',
  styleUrls: ['./employee-completed-projects.css']
})
export class EmployeeCompletedProjectsComponent implements OnInit {
  projects: CompletedProject[] = [];
  filteredProjects: CompletedProject[] = [];
  paginatedProjects: CompletedProject[] = [];
  isLoading = true;
  searchQuery = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  ngOnInit(): void {
    this.loadCompletedProjects();
    this.isLoading = false;
  }

  private loadCompletedProjects(): void {
    // Sample completed projects data
    this.projects = [
      {
        id: 1,
        name: 'Website Homepage Redesign',
        description: 'Updated the main homepage with new branding and modern design elements',
        location: 'Remote',
        clientNumber: '+1 234-567-8901',
        deadline: '2026-01-20',
        completionDate: '2026-01-15',
        priority: 'High',
        status: 'Completed',
        colorTheme: 'blue'
      },
      {
        id: 2,
        name: 'Mobile App Testing',
        description: 'Conducted thorough testing of the iOS and Android mobile applications',
        location: 'Office - Building A',
        clientNumber: '+1 234-567-8902',
        deadline: '2026-01-18',
        completionDate: '2026-01-17',
        priority: 'High',
        status: 'Completed',
        colorTheme: 'peach'
      },
      {
        id: 3,
        name: 'Database Migration',
        description: 'Migrated legacy database to new cloud infrastructure',
        location: 'Remote',
        clientNumber: '+1 234-567-8903',
        deadline: '2025-12-25',
        completionDate: '2025-12-23',
        priority: 'Medium',
        status: 'Completed',
        colorTheme: 'mint'
      },
      {
        id: 4,
        name: 'Security Audit Report',
        description: 'Completed comprehensive security audit and prepared detailed report',
        location: 'Office - Building B',
        clientNumber: '+1 234-567-8904',
        deadline: '2025-12-22',
        completionDate: '2025-12-20',
        priority: 'High',
        status: 'Completed',
        colorTheme: 'lavender'
      },
      {
        id: 5,
        name: 'API Documentation',
        description: 'Wrote comprehensive API documentation for the new REST endpoints',
        location: 'Remote',
        clientNumber: '+1 234-567-8905',
        deadline: '2025-12-28',
        completionDate: '2025-12-27',
        priority: 'Medium',
        status: 'Completed',
        colorTheme: 'blue'
      },
      {
        id: 6,
        name: 'Client Presentation Preparation',
        description: 'Prepared slides and demo for client presentation',
        location: 'Office - Conference Room',
        clientNumber: '+1 234-567-8906',
        deadline: '2025-12-19',
        completionDate: '2025-12-18',
        priority: 'High',
        status: 'Completed',
        colorTheme: 'peach'
      },
      {
        id: 7,
        name: 'User Feedback Analysis',
        description: 'Analyzed user feedback from recent product launch',
        location: 'Remote',
        clientNumber: '+1 234-567-8907',
        deadline: '2025-12-30',
        completionDate: '2025-12-29',
        priority: 'Low',
        status: 'Completed',
        colorTheme: 'mint'
      },
      {
        id: 8,
        name: 'Performance Optimization',
        description: 'Optimized application performance and reduced load times',
        location: 'Remote',
        clientNumber: '+1 234-567-8908',
        deadline: '2025-12-26',
        completionDate: '2025-12-24',
        priority: 'Medium',
        status: 'Completed',
        colorTheme: 'lavender'
      },
      {
        id: 9,
        name: 'Email Campaign Setup',
        description: 'Set up automated email campaigns for customer engagement',
        location: 'Remote',
        clientNumber: '+1 234-567-8909',
        deadline: '2025-12-15',
        completionDate: '2025-12-14',
        priority: 'Medium',
        status: 'Completed',
        colorTheme: 'blue'
      },
      {
        id: 10,
        name: 'Landing Page Design',
        description: 'Designed and implemented new landing page for product launch',
        location: 'Remote',
        clientNumber: '+1 234-567-8910',
        deadline: '2025-12-10',
        completionDate: '2025-12-09',
        priority: 'High',
        status: 'Completed',
        colorTheme: 'peach'
      }
    ];

    this.filteredProjects = [...this.projects];
    this.updatePagination();
  }

  // Search functionality
  onSearch(): void {
    const query = this.searchQuery.toLowerCase().trim();
    
    if (!query) {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.clientNumber.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
      );
    }
    
    this.currentPage = 1;
    this.updatePagination();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }

  // Priority Class
  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High':
        return 'priority-high';
      case 'Medium':
        return 'priority-medium';
      case 'Low':
        return 'priority-low';
      default:
        return '';
    }
  }

  // Pagination Methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProjects.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjects = this.filteredProjects.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Date formatting
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }
}