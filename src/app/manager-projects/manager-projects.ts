// manager-projects.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerSidebarComponent } from '../manager-sidebar/manager-sidebar';

interface Project {
  id: string;
  name: string;
  description: string;
  clientPhone: string;
  location: string;
  category: string;
  dueDate: Date;
  status: 'active' | 'completed' | 'hold';
  progress: number;
  inProgress: number;
  overdue: number;
  color?: string;
  graphPattern?: string;
  assignedUsers: {
    name: string;
    avatar: string;
    initials: string;
  }[];
  tasks: Task[];
}

interface Task {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: Date;
  status: string;
  progress: number;
}

interface NewProject {
  name: string;
  description: string;
  clientPhone: string;
  location: string;
  category: string;
  assignedEmployees: string[];
  dueDate: string;
  color: string;
  graphPattern: string;
}

interface NewTask {
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  dueDate: string;
}

@Component({
  selector: 'app-manager-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ManagerSidebarComponent],
  templateUrl: './manager-projects.html',
  styleUrls: ['./manager-projects.css']
})
export class ManagerProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  paginatedProjects: Project[] = [];
  isLoading = true;

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  searchQuery: string = '';
  activeFilter: 'all' | 'active' | 'completed' | 'hold' = 'all';

  showCreateProjectModal = false;
  showCreateTaskModal = false;
  showProjectDetailsModal = false;
  selectedProject: Project | null = null;

  activeDetailsTab: 'tasks' | 'review' | 'requests' | 'team' = 'tasks';

  newProject: NewProject = {
    name: '',
    description: '',
    clientPhone: '',
    location: '',
    category: 'design',
    assignedEmployees: [],
    dueDate: '',
    color: 'blue',
    graphPattern: 'ascending'
  };

  newTask: NewTask = {
    name: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    dueDate: ''
  };

  categories = [
    { id: 'design', name: 'Design' },
    { id: 'development', name: 'Development' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'qa', name: 'QA' }
  ];

  colors = [
    { id: 'blue', name: 'Blue' },
    { id: 'green', name: 'Green' },
    { id: 'purple', name: 'Purple' },
    { id: 'orange', name: 'Orange' },
    { id: 'red', name: 'Red' },
    { id: 'cyan', name: 'Cyan' },
    { id: 'pink', name: 'Pink' },
    { id: 'indigo', name: 'Indigo' }
  ];

  graphPatterns = [
    { id: 'ascending', name: 'Ascending', path: 'M0,40 L20,35 L40,38 L60,30 L80,32 L100,25 L120,28 L140,20 L160,22 L180,15 L200,18' },
    { id: 'descending', name: 'Descending', path: 'M0,10 L20,15 L40,12 L60,20 L80,18 L100,25 L120,22 L140,30 L160,28 L180,35 L200,32' },
    { id: 'volatile', name: 'Volatile', path: 'M0,25 L20,15 L40,30 L60,10 L80,35 L100,20 L120,40 L140,15 L160,30 L180,20 L200,25' },
    { id: 'steady', name: 'Steady', path: 'M0,25 L20,24 L40,26 L60,25 L80,27 L100,26 L120,25 L140,24 L160,26 L180,25 L200,26' },
    { id: 'growth', name: 'Growth', path: 'M0,45 L20,42 L40,38 L60,35 L80,30 L100,25 L120,20 L140,15 L160,12 L180,8 L200,5' }
  ];

  employees = [
    { id: '1', name: 'John Doe', initials: 'JD' },
    { id: '2', name: 'Jane Smith', initials: 'JS' },
    { id: '3', name: 'Alex Johnson', initials: 'AJ' },
    { id: '4', name: 'Sarah Williams', initials: 'SW' },
    { id: '5', name: 'Mike Brown', initials: 'MB' },
    { id: '6', name: 'Emily Davis', initials: 'ED' }
  ];

  ngOnInit(): void {
    this.loadProjects();
    this.isLoading = false;
  }

  private loadProjects(): void {
    this.projects = [
      {
        id: '1',
        name: 'Mobile App',
        description: 'E-commerce mobile application for retail',
        clientPhone: '+1234567890',
        location: 'New York, USA',
        category: 'design',
        dueDate: new Date('2026-05-30'),
        status: 'active',
        progress: 56,
        inProgress: 5,
        overdue: 2,
        color: 'blue',
        graphPattern: 'ascending',
        assignedUsers: [
          { name: 'John Doe', avatar: '', initials: 'JD' },
          { name: 'Jane Smith', avatar: '', initials: 'JS' },
          { name: 'Alex Johnson', avatar: '', initials: 'AJ' },
          { name: 'Sarah Williams', avatar: '', initials: 'SW' }
        ],
        tasks: [
          {
            id: 't1',
            name: 'Fix Navigation Bug',
            description: 'Fix the navigation issue',
            priority: 'high',
            assignedTo: 'John Doe',
            dueDate: new Date('2026-05-28'),
            status: 'in-progress',
            progress: 75
          },
          {
            id: 't2',
            name: 'Design System Update',
            description: 'Update design system',
            priority: 'medium',
            assignedTo: 'Jane Smith',
            dueDate: new Date('2026-05-29'),
            status: 'in-progress',
            progress: 50
          }
        ]
      },
      {
        id: '2',
        name: 'Dashboard',
        description: 'Analytics dashboard for home monitoring',
        clientPhone: '+1987654321',
        location: 'San Francisco, USA',
        category: 'development',
        dueDate: new Date('2026-05-30'),
        status: 'active',
        progress: 86,
        inProgress: 3,
        overdue: 0,
        color: 'green',
        graphPattern: 'growth',
        assignedUsers: [
          { name: 'John Doe', avatar: '', initials: 'JD' },
          { name: 'Jane Smith', avatar: '', initials: 'JS' }
        ],
        tasks: []
      },
      {
        id: '3',
        name: 'Marketing Campaign',
        description: 'Social media marketing campaign',
        clientPhone: '+1122334455',
        location: 'Los Angeles, USA',
        category: 'marketing',
        dueDate: new Date('2026-06-15'),
        status: 'hold',
        progress: 20,
        inProgress: 1,
        overdue: 0,
        color: 'purple',
        graphPattern: 'steady',
        assignedUsers: [
          { name: 'Alex Johnson', avatar: '', initials: 'AJ' }
        ],
        tasks: []
      }
    ];

    this.applyFilters();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  setFilter(filter: 'all' | 'active' | 'completed' | 'hold'): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.projects];

    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(p => p.status === this.activeFilter);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.filteredProjects = filtered;
    this.updatePagination();
  }

  openCreateProjectModal(): void {
    this.showCreateProjectModal = true;
    this.resetProjectForm();
    document.body.style.overflow = 'hidden';
  }

  closeCreateProjectModal(): void {
    this.showCreateProjectModal = false;
    this.resetProjectForm();
    document.body.style.overflow = 'auto';
  }

  resetProjectForm(): void {
    this.newProject = {
      name: '',
      description: '',
      clientPhone: '',
      location: '',
      category: 'design',
      assignedEmployees: [],
      dueDate: '',
      color: 'blue',
      graphPattern: 'ascending'
    };
  }

  toggleEmployee(employeeId: string): void {
    const index = this.newProject.assignedEmployees.indexOf(employeeId);
    if (index > -1) {
      this.newProject.assignedEmployees.splice(index, 1);
    } else {
      this.newProject.assignedEmployees.push(employeeId);
    }
  }

  isEmployeeSelected(employeeId: string): boolean {
    return this.newProject.assignedEmployees.includes(employeeId);
  }

  createProject(): void {
    if (this.newProject.name && this.newProject.description && 
        this.newProject.clientPhone && this.newProject.location && 
        this.newProject.dueDate) {
      
      const assignedUsers = this.employees
        .filter(e => this.newProject.assignedEmployees.includes(e.id))
        .map(e => ({
          name: e.name,
          avatar: '',
          initials: e.initials
        }));

      const project: Project = {
        id: Date.now().toString(),
        name: this.newProject.name,
        description: this.newProject.description,
        clientPhone: this.newProject.clientPhone,
        location: this.newProject.location,
        category: this.newProject.category,
        dueDate: new Date(this.newProject.dueDate),
        status: 'hold',
        progress: 0,
        inProgress: 0,
        overdue: 0,
        color: this.newProject.color,
        graphPattern: this.newProject.graphPattern,
        assignedUsers: assignedUsers,
        tasks: []
      };

      this.projects.push(project);
      this.applyFilters();
      this.closeCreateProjectModal();

      alert(`Project "${project.name}" has been created successfully!`);
    }
  }

  openProjectDetails(project: Project): void {
    this.selectedProject = project;
    this.showProjectDetailsModal = true;
    this.activeDetailsTab = 'tasks';
    document.body.style.overflow = 'hidden';
  }

  closeProjectDetails(): void {
    this.showProjectDetailsModal = false;
    this.selectedProject = null;
    this.activeDetailsTab = 'tasks';
    document.body.style.overflow = 'auto';
  }

  setDetailsTab(tab: 'tasks' | 'review' | 'requests' | 'team'): void {
    this.activeDetailsTab = tab;
  }

  openCreateTaskModal(): void {
    this.showCreateTaskModal = true;
    this.resetTaskForm();
  }

  closeCreateTaskModal(): void {
    this.showCreateTaskModal = false;
    this.resetTaskForm();
  }

  resetTaskForm(): void {
    this.newTask = {
      name: '',
      description: '',
      priority: 'medium',
      assignedTo: '',
      dueDate: ''
    };
  }

  createTask(): void {
    if (this.selectedProject && this.newTask.name && this.newTask.description && 
        this.newTask.assignedTo && this.newTask.dueDate) {
      
      const task: Task = {
        id: Date.now().toString(),
        name: this.newTask.name,
        description: this.newTask.description,
        priority: this.newTask.priority,
        assignedTo: this.newTask.assignedTo,
        dueDate: new Date(this.newTask.dueDate),
        status: 'pending',
        progress: 0
      };

      this.selectedProject.tasks.push(task);
      this.selectedProject.inProgress++;
      this.closeCreateTaskModal();

      alert(`Task "${task.name}" has been added successfully!`);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'hold': return 'status-hold';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'IN PROGRESS';
      case 'hold': return 'ON HOLD';
      case 'completed': return 'COMPLETED';
      default: return status.toUpperCase();
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  }

  getDaysLeft(dueDate: Date): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getCardClass(project: Project): string {
    return `project-card project-card-${project.color || 'blue'}`;
  }

  getGraphPath(project: Project): string {
    const pattern = this.graphPatterns.find(p => p.id === project.graphPattern);
    return pattern ? pattern.path : this.graphPatterns[0].path;
  }

  getGraphAreaPath(project: Project): string {
    const linePath = this.getGraphPath(project);
    return `${linePath} L200,50 L0,50 Z`;
  }

  getTaskCountForMember(memberName: string): number {
    if (!this.selectedProject) return 0;
    return this.selectedProject.tasks.filter(task => task.assignedTo === memberName).length;
  }

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

  getEmployeeName(employeeId: string): string {
    const employee = this.employees.find(e => e.id === employeeId);
    return employee ? employee.name : '';
  }
}