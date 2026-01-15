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
  videoStream: MediaStream | null = null;
  showCameraModal: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    console.log('Employee dashboard data loaded');
  }

  onCardClick(route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Validate file type
      if (!this.selectedFile.type.startsWith('image/')) {
        alert('Please select a valid image file');
        this.selectedFile = null;
        return;
      }

      // Validate file size (max 5MB)
      if (this.selectedFile.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        this.selectedFile = null;
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.photoPreview = e.target?.result as string;
        this.attendanceStatus.photoUploaded = true;
        // Close the modal after file upload
        this.closeCamera();
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        this.selectedFile = null;
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

  async openCamera(): Promise<void> {
    this.showCameraModal = true;

    try {
      // Request camera access
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      // Wait for DOM to update
      setTimeout(() => {
        const videoElement = document.getElementById('cameraVideo') as HTMLVideoElement;
        if (videoElement && this.videoStream) {
          videoElement.srcObject = this.videoStream;
          videoElement.onloadedmetadata = () => {
            videoElement.play().catch(e => console.error('Error playing video:', e));
          };
        }
      }, 100);
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Unable to access camera. Please check permissions or use file upload instead.');
      this.closeCamera();
    }
  }

  capturePhoto(): void {
    const videoElement = document.getElementById('cameraVideo') as HTMLVideoElement;

    if (videoElement && videoElement.srcObject) {
      // Ensure video has dimensions and is ready
      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
        console.warn('Video dimensions not ready yet');
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        // Draw the current video frame to canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL and save it
        this.photoPreview = canvas.toDataURL('image/jpeg', 0.9);
        this.attendanceStatus.photoUploaded = true;
        
        // Close camera after capturing
        this.closeCamera();
      }
    }
  }

  closeCamera(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    this.showCameraModal = false;
  }

  checkIn(): void {
    if (!this.attendanceStatus.photoUploaded) {
      // Open camera/upload modal when clicking Clock In without photo
      this.openCamera().catch(() => {
        // If camera fails, just show the modal for file upload
        this.showCameraModal = true;
      });
      return;
    }

    // Photo is already uploaded, proceed with check-in
    const now = new Date();
    this.attendanceStatus.isCheckedIn = true;
    this.attendanceStatus.checkInTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

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
      minute: '2-digit',
      hour12: true
    });

    console.log('Checked out at:', this.attendanceStatus.checkOutTime);
  }

  removePhoto(): void {
    if (confirm('Are you sure you want to remove the photo? This will reset your attendance.')) {
      this.selectedFile = null;
      this.photoPreview = null;
      this.attendanceStatus.photoUploaded = false;
      this.attendanceStatus.isCheckedIn = false;
      this.attendanceStatus.checkInTime = null;
      this.attendanceStatus.checkOutTime = null;
    }
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

  ngOnDestroy(): void {
    this.closeCamera();
  }
}