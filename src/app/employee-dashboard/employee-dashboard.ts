// employee-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeSidebarComponent } from '../employee-sidebar/employee-sidebar';


interface SummaryCard {
  title: string;
  value: number;
  icon: string;
  bgColor: string;
  accentColor: string;
  iconBg: string;
  description: string;
  route?: string;
}

interface AttendanceStatus {
  isCheckedIn: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  photoUploaded: boolean;
}

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, EmployeeSidebarComponent],
  templateUrl: './employee-dashboard.html',
  styleUrls: ['./employee-dashboard.css']
})
export class EmployeeDashboardComponent implements OnInit {
  summaryCards: SummaryCard[] = [
    {
      title: 'My Tasks',
      value: 12,
      icon: 'fa-tasks',
      bgColor: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
      accentColor: '#0EA5E9',
      iconBg: 'rgba(14, 165, 233, 0.15)',
      description: 'Total Assigned Tasks',
      route: '/employee/tasks/my'
    },
    {
      title: 'Completed Tasks',
      value: 8,
      icon: 'fa-check-circle',
      bgColor: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
      accentColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      description: 'Tasks Completed',
      route: '/employee/projects/completed'
    }
  ];

  attendanceStatus: AttendanceStatus = {
    isCheckedIn: false,
    checkInTime: null,
    checkOutTime: null,
    photoUploaded: false
  };

  selectedFile: File | null = null;
  photoPreview: string | null = null;
  showCamera: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadDashboardData();
    this.checkTodayAttendance();
  }

  loadDashboardData(): void {
    console.log('Employee dashboard data loaded');
    // Load employee-specific data here
  }

  onCardClick(route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  checkTodayAttendance(): void {
    // Check if already checked in today
    const storedAttendance = localStorage.getItem('todayAttendance');
    if (storedAttendance) {
      this.attendanceStatus = JSON.parse(storedAttendance);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.photoPreview = e.target?.result as string;
        this.attendanceStatus.photoUploaded = true;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('photoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  openCamera(): void {
    this.showCamera = true;
    // Implement camera logic here using navigator.mediaDevices.getUserMedia
    console.log('Camera opened');
  }

  checkIn(): void {
    if (!this.attendanceStatus.photoUploaded) {
      alert('Please upload a photo for verification before checking in');
      return;
    }

    const now = new Date();
    this.attendanceStatus.isCheckedIn = true;
    this.attendanceStatus.checkInTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Save to localStorage
    localStorage.setItem('todayAttendance', JSON.stringify(this.attendanceStatus));

    console.log('Checked in at:', this.attendanceStatus.checkInTime);
  }

  checkOut(): void {
    if (!this.attendanceStatus.isCheckedIn) {
      alert('You need to check in first');
      return;
    }

    const now = new Date();
    this.attendanceStatus.checkOutTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Save to localStorage
    localStorage.setItem('todayAttendance', JSON.stringify(this.attendanceStatus));

    console.log('Checked out at:', this.attendanceStatus.checkOutTime);
  }

  removePhoto(): void {
    this.selectedFile = null;
    this.photoPreview = null;
    this.attendanceStatus.photoUploaded = false;
  }

  getCurrentStatus(): string {
    if (this.attendanceStatus.checkOutTime) {
      return `Checked Out at ${this.attendanceStatus.checkOutTime}`;
    } else if (this.attendanceStatus.isCheckedIn) {
      return `Checked In at ${this.attendanceStatus.checkInTime}`;
    } else {
      return 'Not Checked In';
    }
  }

  getStatusClass(): string {
    if (this.attendanceStatus.checkOutTime) {
      return 'status-checked-out';
    } else if (this.attendanceStatus.isCheckedIn) {
      return 'status-checked-in';
    } else {
      return 'status-not-checked-in';
    }
  }
}