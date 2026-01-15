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
  imports: [CommonModule, FormsModule,AdminSidebarComponent],
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

  // Employees list
  employees: Employee[] = [
    {
      id: 1,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      contactNumber: '+1 234-567-8904'
    },
    {
      id: 2,
      name: 'Robert Wilson',
      email: 'robert.w@company.com',
      contactNumber: '+1 234-567-8905'
    },
    {
      id: 3,
      name: 'Jennifer Martinez',
      email: 'jennifer.m@company.com',
      contactNumber: '+1 234-567-8906'
    },
    {
      id: 4,
      name: 'David Anderson',
      email: 'david.a@company.com',
      contactNumber: '+1 234-567-8907'
    }
  ];

  // Create new employee
  createEmployee() {
    if (this.isFormValid()) {
      const employee: Employee = {
        id: this.employees.length + 1,
        name: this.newEmployee.name,
        email: this.newEmployee.email,
        contactNumber: this.newEmployee.contactNumber
      };
      
      this.employees.push(employee);
      this.resetForm();
      alert('Employee created successfully!');
    } else {
      alert('Please fill in all fields');
    }
  }

  // Edit employee
  editEmployee(employee: Employee) {
    console.log('Edit employee:', employee);
    alert(`Edit functionality for ${employee.name} - Coming soon!`);
  }

  // Delete employee
  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employees = this.employees.filter(e => e.id !== id);
      alert('Employee deleted successfully!');
    }
  }

  // Form validation
  isFormValid(): boolean {
    return !!(
      this.newEmployee.name.trim() &&
      this.newEmployee.email.trim() &&
      this.newEmployee.password.trim() &&
      this.newEmployee.contactNumber.trim()
    );
  }

  // Reset form
  resetForm() {
    this.newEmployee = {
      name: '',
      email: '',
      password: '',
      contactNumber: ''
    };
  }
}