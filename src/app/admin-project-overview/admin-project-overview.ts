// admin-project-overview.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

interface Employee {
  id: number;
  name: string;
  avatar?: string;
  initials: string;
  email?: string;
  contactNumber?: string;
  password?: string;
}

interface Project {
  id: number;
  name: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  progress: number;
  manager: {
    name: string;
    avatar?: string;
    initials: string;
  };
  employees: Employee[];
  colorTheme: string;
}

@Component({
  selector: 'app-admin-project-overview',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, FormsModule],
  templateUrl: './admin-project-overview.html',
  styleUrls: ['./admin-project-overview.css']
})
export class AdminProjectOverviewComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  paginatedProjects: Project[] = [];
  employees: Employee[] = [];
  newEmployee: Employee = {
    id: 0,
    name: '',
    initials: '',
    email: '',
    contactNumber: '',
    password: ''
  };
  isLoading = true;
  
  // Filter
  selectedFilter: string = 'all';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  ngOnInit(): void {
    this.loadProjects();
    this.applyFilter();
    this.isLoading = false;
  }

  private loadProjects(): void {
    // Sample project data
    this.projects = [
      {
        id: 1,
        name: 'E-Commerce Platform Redesign',
        status: 'In Progress',
        progress: 65,
        manager: {
          name: 'Sarah Johnson',
          initials: 'SJ'
        },
        employees: [
          { id: 1, name: 'John Doe', initials: 'JD' },
          { id: 2, name: 'Jane Smith', initials: 'JS' },
          { id: 3, name: 'Mike Wilson', initials: 'MW' },
          { id: 4, name: 'Emily Brown', initials: 'EB' },
          { id: 5, name: 'David Lee', initials: 'DL' }
        ],
        colorTheme: 'blue'
      },
      {
        id: 2,
        name: 'Mobile App Development',
        status: 'Completed',
        progress: 100,
        manager: {
          name: 'Michael Chen',
          initials: 'MC'
        },
        employees: [
          { id: 6, name: 'Alice Cooper', initials: 'AC' },
          { id: 7, name: 'Bob Martin', initials: 'BM' },
          { id: 8, name: 'Carol White', initials: 'CW' }
        ],
        colorTheme: 'mint'
      },
      {
        id: 3,
        name: 'Customer Portal Enhancement',
        status: 'On Hold',
        progress: 40,
        manager: {
          name: 'Emma Davis',
          initials: 'ED'
        },
        employees: [
          { id: 9, name: 'Tom Harris', initials: 'TH' },
          { id: 10, name: 'Lisa Anderson', initials: 'LA' },
          { id: 11, name: 'Mark Taylor', initials: 'MT' },
          { id: 12, name: 'Nina Patel', initials: 'NP' }
        ],
        colorTheme: 'peach'
      },
      {
        id: 4,
        name: 'Data Analytics Dashboard',
        status: 'In Progress',
        progress: 80,
        manager: {
          name: 'Robert Williams',
          initials: 'RW'
        },
        employees: [
          { id: 13, name: 'Kevin Brown', initials: 'KB' },
          { id: 14, name: 'Sophie Turner', initials: 'ST' },
          { id: 15, name: 'Oliver Green', initials: 'OG' },
          { id: 16, name: 'Rachel Adams', initials: 'RA' },
          { id: 17, name: 'Peter Clark', initials: 'PC' },
          { id: 18, name: 'Amy Scott', initials: 'AS' }
        ],
        colorTheme: 'lavender'
      },
      {
        id: 5,
        name: 'Security Audit & Compliance',
        status: 'In Progress',
        progress: 55,
        manager: {
          name: 'Jennifer Lopez',
          initials: 'JL'
        },
        employees: [
          { id: 19, name: 'Chris Evans', initials: 'CE' },
          { id: 20, name: 'Diana Prince', initials: 'DP' }
        ],
        colorTheme: 'blue'
      },
      {
        id: 6,
        name: 'Marketing Automation System',
        status: 'Completed',
        progress: 100,
        manager: {
          name: 'Daniel Garcia',
          initials: 'DG'
        },
        employees: [
          { id: 21, name: 'Frank Miller', initials: 'FM' },
          { id: 22, name: 'Grace Lee', initials: 'GL' },
          { id: 23, name: 'Henry Ford', initials: 'HF' }
        ],
        colorTheme: 'mint'
      },
      {
        id: 7,
        name: 'Cloud Infrastructure Migration',
        status: 'In Progress',
        progress: 45,
        manager: {
          name: 'Alex Thompson',
          initials: 'AT'
        },
        employees: [
          { id: 24, name: 'Sam Wilson', initials: 'SW' },
          { id: 25, name: 'Kate Bishop', initials: 'KB' },
          { id: 26, name: 'Tony Stark', initials: 'TS' }
        ],
        colorTheme: 'lavender'
      },
      {
        id: 8,
        name: 'UI/UX Redesign Initiative',
        status: 'On Hold',
        progress: 30,
        manager: {
          name: 'Jessica Parker',
          initials: 'JP'
        },
        employees: [
          { id: 27, name: 'Bruce Wayne', initials: 'BW' },
          { id: 28, name: 'Clark Kent', initials: 'CK' }
        ],
        colorTheme: 'peach'
      }
    ];
  }

  // Get project count by status
  getProjectCountByStatus(status: string): number {
    return this.projects.filter(project => project.status === status).length;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-in-progress';
      case 'On Hold':
        return 'status-on-hold';
      default:
        return '';
    }
  }

  getProgressBarClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'progress-completed';
      case 'In Progress':
        return 'progress-in-progress';
      case 'On Hold':
        return 'progress-on-hold';
      default:
        return '';
    }
  }

  getVisibleEmployees(employees: Employee[]): Employee[] {
    return employees.slice(0, 4);
  }

  getRemainingCount(employees: Employee[]): number {
    return Math.max(0, employees.length - 4);
  }

  viewProjectDetails(project: Project): void {
    console.log('Viewing project details:', project);
    // Implement navigation or modal to show project details
  }

  createEmployee(): void {
    if (this.newEmployee.name && this.newEmployee.email && this.newEmployee.contactNumber && this.newEmployee.password) {
      const employee: Employee = {
        id: this.employees.length + 1,
        name: this.newEmployee.name,
        initials: this.newEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        email: this.newEmployee.email,
        contactNumber: this.newEmployee.contactNumber,
        password: this.newEmployee.password
      };
      this.employees.push(employee);
      this.resetForm();
      console.log('Employee created:', employee);
    }
  }

  resetForm(): void {
    this.newEmployee = {
      id: 0,
      name: '',
      initials: '',
      email: '',
      contactNumber: '',
      password: ''
    };
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employees = this.employees.filter(emp => emp.id !== id);
      console.log('Deleted employee with id:', id);
    }
  }

  editEmployee(employee: Employee): void {
    console.log('Editing employee:', employee);
    // Implement edit functionality
    // This might open a modal or navigate to an edit page
  }

  // Filter methods
  applyFilter(): void {
    if (this.selectedFilter === 'all') {
      this.filteredProjects = [...this.projects];
    } else if (this.selectedFilter === 'completed') {
      this.filteredProjects = this.projects.filter(p => p.status === 'Completed');
    } else if (this.selectedFilter === 'in-progress') {
      this.filteredProjects = this.projects.filter(p => p.status === 'In Progress');
    } else if (this.selectedFilter === 'on-hold') {
      this.filteredProjects = this.projects.filter(p => p.status === 'On Hold');
    }
    
    this.currentPage = 1;
    this.updatePagination();
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  // Pagination methods
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
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}