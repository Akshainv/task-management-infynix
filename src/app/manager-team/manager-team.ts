// manager-team.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerSidebarComponent } from '../manager-sidebar/manager-sidebar';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  tasksAssigned: number;
  tasksCompleted: number;
  initials: string;
  colorTheme: string;
}

interface NewMember {
  name: string;
  email: string;
  contactNumber: string;
  role: string;
  department: string;
  colorTheme: string;
}

@Component({
  selector: 'app-manager-team',
  standalone: true,
  imports: [CommonModule, FormsModule, ManagerSidebarComponent],
  templateUrl: './manager-team.html',
  styleUrls: ['./manager-team.css']
})
export class ManagerTeamComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];
  paginatedMembers: TeamMember[] = [];
  isLoading = true;

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  searchQuery: string = '';
  selectedFilter: string = 'all';

  showAddMemberModal = false;
  showEditMemberModal = false;
  selectedMember: TeamMember | null = null;

  newMember: NewMember = {
    name: '',
    email: '',
    contactNumber: '',
    role: 'Developer',
    department: 'Engineering',
    colorTheme: 'blue'
  };

  roles: string[] = [
    'Developer',
    'Senior Developer',
    'Team Lead',
    'QA Engineer',
    'Designer',
    'Product Manager',
    'DevOps Engineer',
    'Business Analyst'
  ];

  departments: string[] = [
    'Engineering',
    'Design',
    'Product',
    'Quality Assurance',
    'DevOps',
    'Marketing',
    'Sales',
    'Human Resources'
  ];

  colorThemes: string[] = [
    'blue',
    'mint',
    'peach',
    'lavender',
    'cyan',
    'pink',
    'orange',
    'indigo'
  ];

  ngOnInit(): void {
    this.loadTeamMembers();
    this.isLoading = false;
  }

  private loadTeamMembers(): void {
    this.teamMembers = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        contactNumber: '+1 234-567-8901',
        role: 'Senior Developer',
        department: 'Engineering',
        status: 'Active',
        tasksAssigned: 15,
        tasksCompleted: 12,
        initials: 'SJ',
        colorTheme: 'blue'
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        contactNumber: '+1 234-567-8902',
        role: 'QA Engineer',
        department: 'Quality Assurance',
        status: 'Active',
        tasksAssigned: 10,
        tasksCompleted: 8,
        initials: 'MC',
        colorTheme: 'mint'
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        contactNumber: '+1 234-567-8903',
        role: 'Designer',
        department: 'Design',
        status: 'Active',
        tasksAssigned: 12,
        tasksCompleted: 10,
        initials: 'ER',
        colorTheme: 'peach'
      },
      {
        id: 4,
        name: 'David Kim',
        email: 'david.kim@company.com',
        contactNumber: '+1 234-567-8904',
        role: 'DevOps Engineer',
        department: 'DevOps',
        status: 'On Leave',
        tasksAssigned: 8,
        tasksCompleted: 5,
        initials: 'DK',
        colorTheme: 'lavender'
      },
      {
        id: 5,
        name: 'Jessica Taylor',
        email: 'jessica.taylor@company.com',
        contactNumber: '+1 234-567-8905',
        role: 'Team Lead',
        department: 'Engineering',
        status: 'Active',
        tasksAssigned: 20,
        tasksCompleted: 18,
        initials: 'JT',
        colorTheme: 'cyan'
      },
      {
        id: 6,
        name: 'Robert Anderson',
        email: 'robert.anderson@company.com',
        contactNumber: '+1 234-567-8906',
        role: 'Developer',
        department: 'Engineering',
        status: 'Active',
        tasksAssigned: 14,
        tasksCompleted: 11,
        initials: 'RA',
        colorTheme: 'pink'
      },
      {
        id: 7,
        name: 'Amanda White',
        email: 'amanda.white@company.com',
        contactNumber: '+1 234-567-8907',
        role: 'Product Manager',
        department: 'Product',
        status: 'Inactive',
        tasksAssigned: 6,
        tasksCompleted: 3,
        initials: 'AW',
        colorTheme: 'orange'
      },
      {
        id: 8,
        name: 'Christopher Lee',
        email: 'christopher.lee@company.com',
        contactNumber: '+1 234-567-8908',
        role: 'Business Analyst',
        department: 'Product',
        status: 'Active',
        tasksAssigned: 11,
        tasksCompleted: 9,
        initials: 'CL',
        colorTheme: 'indigo'
      }
    ];

    this.applyFilters();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.teamMembers];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.department.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      const statusMap: { [key: string]: string } = {
        'active': 'Active',
        'inactive': 'Inactive',
        'on-leave': 'On Leave'
      };
      const targetStatus = statusMap[this.selectedFilter];
      filtered = filtered.filter(member => member.status === targetStatus);
    }

    this.filteredMembers = filtered;
    this.updatePagination();
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Active': 'status-active',
      'Inactive': 'status-inactive',
      'On Leave': 'status-on-leave'
    };
    return classes[status] || '';
  }

  getCompletionPercentage(member: TeamMember): number {
    if (member.tasksAssigned === 0) return 0;
    return Math.round((member.tasksCompleted / member.tasksAssigned) * 100);
  }

  openAddMemberModal(): void {
    this.showAddMemberModal = true;
    this.newMember = {
      name: '',
      email: '',
      contactNumber: '',
      role: 'Developer',
      department: 'Engineering',
      colorTheme: 'blue'
    };
    document.body.style.overflow = 'hidden';
  }

  closeAddMemberModal(): void {
    this.showAddMemberModal = false;
    document.body.style.overflow = 'auto';
  }

  openEditMemberModal(member: TeamMember): void {
    this.selectedMember = { ...member };
    this.showEditMemberModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeEditMemberModal(): void {
    this.showEditMemberModal = false;
    this.selectedMember = null;
    document.body.style.overflow = 'auto';
  }

  addMember(): void {
    if (!this.newMember.name || !this.newMember.email || !this.newMember.contactNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const initials = this.newMember.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);

    const newTeamMember: TeamMember = {
      id: this.teamMembers.length + 1,
      name: this.newMember.name,
      email: this.newMember.email,
      contactNumber: this.newMember.contactNumber,
      role: this.newMember.role,
      department: this.newMember.department,
      status: 'Active',
      tasksAssigned: 0,
      tasksCompleted: 0,
      initials: initials,
      colorTheme: this.newMember.colorTheme
    };

    this.teamMembers.push(newTeamMember);
    this.applyFilters();
    this.closeAddMemberModal();

    alert(`Team member "${newTeamMember.name}" has been added successfully!`);
  }

  updateMember(): void {
    if (!this.selectedMember) return;

    const index = this.teamMembers.findIndex(m => m.id === this.selectedMember!.id);
    if (index !== -1) {
      this.teamMembers[index] = { ...this.selectedMember };
      this.applyFilters();
      this.closeEditMemberModal();

      alert(`Team member "${this.selectedMember.name}" has been updated successfully!`);
    }
  }

  deleteMember(id: number): void {
    const member = this.teamMembers.find(m => m.id === id);
    if (!member) return;

    if (confirm(`Are you sure you want to delete "${member.name}" from the team?`)) {
      this.teamMembers = this.teamMembers.filter(m => m.id !== id);
      this.applyFilters();

      alert(`Team member "${member.name}" has been deleted successfully!`);
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMembers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMembers = this.filteredMembers.slice(startIndex, endIndex);
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
}