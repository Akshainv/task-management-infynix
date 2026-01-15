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
    // Add more entries to test pagination...
  ];

  // Pagination
  currentPage = 1;
  pageSize = 10;

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
   * Now properly typed as (number | string)[]
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
  createManager() {
    if (this.isFormValid()) {
      const manager: Manager = {
        id: this.managers.length + 1,
        name: this.newManager.name.trim(),
        email: this.newManager.email.trim(),
        company: this.newManager.company.trim(),
        contactNumber: this.newManager.contactNumber.trim()
      };

      this.managers.push(manager);
      this.resetForm();
      alert('Manager created successfully!');
    } else {
      alert('Please fill all required fields');
    }
  }

  editManager(manager: Manager) {
    alert(`Edit functionality for ${manager.name} - Coming soon!`);
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
  }
}