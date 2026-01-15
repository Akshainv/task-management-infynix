import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

interface Employee {
  id: number;
  name: string;
  email: string;
  contactNumber: string;
}

@Component({
  selector: 'app-admin-employee',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-employee.html',
  styleUrls: ['./admin-employee.css']
})
export class AdminEmployeeComponent {
  // Form model
  newEmployee = {
    name: '',
    email: '',
    password: '',
    contactNumber: ''
  };

  // Employees list (expanded with more data)
  employees: Employee[] = [
    { id: 1, name: 'Emily Davis', email: 'emily.davis@company.com', contactNumber: '+1 234-567-8904' },
    { id: 2, name: 'Robert Wilson', email: 'robert.w@company.com', contactNumber: '+1 234-567-8905' },
    { id: 3, name: 'Jennifer Martinez', email: 'jennifer.m@company.com', contactNumber: '+1 234-567-8906' },
    { id: 4, name: 'David Anderson', email: 'david.a@company.com', contactNumber: '+1 234-567-8907' },
    { id: 5, name: 'Sarah Thompson', email: 'sarah.t@company.com', contactNumber: '+1 234-567-8908' },
    { id: 6, name: 'Michael Brown', email: 'michael.b@company.com', contactNumber: '+1 234-567-8909' },
    { id: 7, name: 'Lisa Johnson', email: 'lisa.j@company.com', contactNumber: '+1 234-567-8910' },
    { id: 8, name: 'James Garcia', email: 'james.g@company.com', contactNumber: '+1 234-567-8911' },
    { id: 9, name: 'Patricia Lee', email: 'patricia.l@company.com', contactNumber: '+1 234-567-8912' },
    { id: 10, name: 'Christopher White', email: 'chris.w@company.com', contactNumber: '+1 234-567-8913' },
    { id: 11, name: 'Amanda Rodriguez', email: 'amanda.r@company.com', contactNumber: '+1 234-567-8914' },
    { id: 12, name: 'Daniel Taylor', email: 'daniel.t@company.com', contactNumber: '+1 234-567-8915' },
  ];

  // Pagination - 6 items per page
  currentPage = 1;
  pageSize = 6;

  get totalPages(): number {
    return Math.ceil(this.employees.length / this.pageSize);
  }

  get paginatedEmployees(): Employee[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.employees.slice(start, start + this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  /**
   * Returns visible page numbers with ellipsis (...)
   */
  getVisiblePages(): (number | string)[] {
    const total = this.totalPages;

    // If few pages → show all
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    // Near the beginning
    if (this.currentPage <= 4) {
      return [1, 2, 3, 4, 5, 6, '...', total];
    }

    // Near the end
    if (this.currentPage >= total - 3) {
      return [1, '...', total - 5, total - 4, total - 3, total - 2, total - 1, total];
    }

    // In the middle
    return [1, '...', this.currentPage - 1, this.currentPage, this.currentPage + 1, '...', total];
  }

  // ── Form Actions ───────────────────────────────────────
  createEmployee() {
    if (this.isFormValid()) {
      const employee: Employee = {
        id: this.employees.length + 1,
        name: this.newEmployee.name.trim(),
        email: this.newEmployee.email.trim(),
        contactNumber: this.newEmployee.contactNumber.trim()
      };

      this.employees.push(employee);
      this.resetForm();
      alert('Employee created successfully!');
      
      // Navigate to last page to see the new employee
      this.currentPage = this.totalPages;
    } else {
      alert('Please fill all required fields');
    }
  }

  editEmployee(employee: Employee) {
    alert(`Edit functionality for ${employee.name} - Coming soon!`);
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employees = this.employees.filter(e => e.id !== id);
      
      // Adjust current page if necessary after deletion
      if (this.paginatedEmployees.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
      
      alert('Employee deleted successfully!');
    }
  }

  isFormValid(): boolean {
    return !!(
      this.newEmployee.name.trim() &&
      this.newEmployee.email.trim() &&
      this.newEmployee.password.trim() &&
      this.newEmployee.contactNumber.trim()
    );
  }

  resetForm() {
    this.newEmployee = { name: '', email: '', password: '', contactNumber: '' };
  }
}