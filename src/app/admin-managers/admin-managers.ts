import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar';

interface Manager {
  id: number;
  name: string;
  email: string;
  company: string;
  contactNumber: string;
}

@Component({
  selector: 'app-admin-managers',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  templateUrl: './admin-managers.html',
  styleUrls: ['./admin-managers.css']
})
export class AdminManagersComponent {
  // Form model
  newManager = {
    name: '',
    email: '',
    password: '',
    company: '',
    contactNumber: ''
  };

  // Managers list (mock data)
  managers: Manager[] = [
    { id: 1, name: 'John Smith', email: 'john.smith@company.com', company: 'Tech Solutions Inc.', contactNumber: '+1 234-567-8901' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah.j@enterprise.com', company: 'Enterprise Corp', contactNumber: '+91 98765 43210' },
    { id: 3, name: 'Michael Brown', email: 'michael.b@innovation.com', company: 'Innovation Labs', contactNumber: '+44 20 1234 5678' },
    { id: 4, name: 'Priya Sharma', email: 'priya@futuretech.in', company: 'Future Technologies', contactNumber: '+91 81234 56789' },
    { id: 5, name: 'David Wilson', email: 'david.w@techcorp.com', company: 'Tech Corporation', contactNumber: '+1 555-123-4567' },
    { id: 6, name: 'Emily Chen', email: 'emily.chen@startups.io', company: 'Startup Ventures', contactNumber: '+86 138 0000 1234' },
    { id: 7, name: 'Robert Taylor', email: 'robert.t@global.com', company: 'Global Industries', contactNumber: '+44 7700 900123' },
    { id: 8, name: 'Lisa Anderson', email: 'lisa.a@digital.net', company: 'Digital Solutions', contactNumber: '+1 415-555-0100' },
    { id: 9, name: 'James Martinez', email: 'james.m@consulting.com', company: 'Elite Consulting', contactNumber: '+34 600 123 456' },
    { id: 10, name: 'Maria Garcia', email: 'maria.g@innovations.es', company: 'Innovation Group', contactNumber: '+34 91 123 45 67' },
    { id: 11, name: 'Thomas Lee', email: 'thomas.lee@tech.kr', company: 'Korean Tech Ltd', contactNumber: '+82 10-1234-5678' },
    { id: 12, name: 'Sophie Martin', email: 'sophie.m@france.fr', company: 'French Solutions', contactNumber: '+33 6 12 34 56 78' },
  ];

  // Pagination - 6 items per page
  currentPage = 1;
  pageSize = 6;

  get totalPages(): number {
    return Math.ceil(this.managers.length / this.pageSize);
  }

  get paginatedManagers(): Manager[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.managers.slice(start, start + this.pageSize);
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
  // Edit state
  isEditing = false;
  editingId: number | null = null;

  // ── Form Actions ───────────────────────────────────────
  createManager() {
    if (this.isFormValid()) {
      if (this.isEditing && this.editingId !== null) {
        // Update existing manager
        const index = this.managers.findIndex(m => m.id === this.editingId);
        if (index !== -1) {
          this.managers[index] = {
            id: this.editingId,
            name: this.newManager.name.trim(),
            email: this.newManager.email.trim(),
            company: this.newManager.company.trim(),
            contactNumber: this.newManager.contactNumber.trim()
          };
          alert('Manager updated successfully!');
        }
      } else {
        // Create new manager
        const manager: Manager = {
          id: this.managers.length + 1,
          name: this.newManager.name.trim(),
          email: this.newManager.email.trim(),
          company: this.newManager.company.trim(),
          contactNumber: this.newManager.contactNumber.trim()
        };
        this.managers.push(manager);
        alert('Manager created successfully!');
        // Navigate to last page to see the new manager
        this.currentPage = this.totalPages;
      }

      this.resetForm();
    } else {
      alert('Please fill all required fields');
    }
  }

  editManager(manager: Manager) {
    this.isEditing = true;
    this.editingId = manager.id;
    this.newManager = {
      name: manager.name,
      email: manager.email,
      password: '', // Password not stored in list, reset to blank
      company: manager.company,
      contactNumber: manager.contactNumber
    };

    // Scroll to form
    const formElement = document.querySelector('.manager-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  deleteManager(id: number) {
    if (confirm('Are you sure you want to delete this manager?')) {
      this.managers = this.managers.filter(m => m.id !== id);

      // Adjust current page if necessary after deletion
      if (this.paginatedManagers.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }

      alert('Manager deleted successfully!');
    }
  }

  isFormValid(): boolean {
    // If editing, password is optional if untaught (but for now we require it or just checks non-empty)
    // To keep it simple, we require all fields.
    return !!(
      this.newManager.name.trim() &&
      this.newManager.email.trim() &&
      this.newManager.password.trim() &&
      this.newManager.company.trim() &&
      this.newManager.contactNumber.trim()
    );
  }

  resetForm() {
    this.newManager = { name: '', email: '', password: '', company: '', contactNumber: '' };
    this.isEditing = false;
    this.editingId = null;
  }
}