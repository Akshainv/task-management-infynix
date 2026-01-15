// employee-my-tasks.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeSidebarComponent } from '../employee-sidebar/employee-sidebar';

interface Task {
  id: number;
  name: string;
  description: string;
  location: string;
  clientNumber: string;
  deadline: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  attachments: {
    photos: string[];
    videos: string[];
    audio: string[];
    notes: string;
  };
  colorTheme: string;
}

interface TaskUpdate {
  photos: File[];
  videos: File[];
  audio: File[];
  notes: string;
}

@Component({
  selector: 'app-employee-my-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeSidebarComponent],
  templateUrl: './employee-my-tasks.html',
  styleUrls: ['./employee-my-tasks.css']
})
export class EmployeeMyTasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  paginatedTasks: Task[] = [];
  isLoading = true;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  // Modal
  isUpdateModalOpen = false;
  selectedTask: Task | null = null;
  taskUpdate: TaskUpdate = {
    photos: [],
    videos: [],
    audio: [],
    notes: ''
  };
  
  // Preview URLs
  photoPreviewUrls: string[] = [];
  videoPreviewUrls: string[] = [];
  audioPreviewUrls: string[] = [];

  // Media Capture States
  isRecordingAudio = false;
  isRecordingVideo = false;
  isCameraActive = false;
  audioRecordingTime = 0;
  videoRecordingTime = 0;
  
  // Media Streams and Recorders
  private mediaRecorder: MediaRecorder | null = null;
  private videoRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private videoChunks: Blob[] = [];
  private recordingInterval: any = null;
  private cameraStream: MediaStream | null = null;
  private videoStream: MediaStream | null = null;

  ngOnInit(): void {
    this.loadTasks();
    this.isLoading = false;
  }

  private loadTasks(): void {
    // Sample task data
    this.tasks = [
      {
        id: 1,
        name: 'Website Homepage Redesign',
        description: 'Update the main homepage with new branding and modern design elements',
        location: 'Remote',
        clientNumber: '+1 234-567-8901',
        deadline: '2026-01-20',
        priority: 'High',
        status: 'In Progress',
        attachments: {
          photos: [],
          videos: [],
          audio: [],
          notes: ''
        },
        colorTheme: 'blue'
      },
      {
        id: 2,
        name: 'Mobile App Testing',
        description: 'Conduct thorough testing of the iOS and Android mobile applications',
        location: 'Office - Building A',
        clientNumber: '+1 234-567-8902',
        deadline: '2026-01-18',
        priority: 'High',
        status: 'Pending',
        attachments: {
          photos: [],
          videos: [],
          audio: [],
          notes: ''
        },
        colorTheme: 'peach'
      },
      {
        id: 3,
        name: 'Database Migration',
        description: 'Migrate legacy database to new cloud infrastructure',
        location: 'Remote',
        clientNumber: '+1 234-567-8903',
        deadline: '2026-01-25',
        priority: 'Medium',
        status: 'In Progress',
        attachments: {
          photos: [],
          videos: [],
          audio: [],
          notes: ''
        },
        colorTheme: 'mint'
      },
      {
        id: 4,
        name: 'Security Audit Report',
        description: 'Complete comprehensive security audit and prepare detailed report',
        location: 'Office - Building B',
        clientNumber: '+1 234-567-8904',
        deadline: '2026-01-22',
        priority: 'High',
        status: 'Pending',
        attachments: {
          photos: [],
          videos: [],
          audio: [],
          notes: ''
        },
        colorTheme: 'lavender'
      },
      {
        id: 5,
        name: 'API Documentation',
        description: 'Write comprehensive API documentation for the new REST endpoints',
        location: 'Remote',
        clientNumber: '+1 234-567-8905',
        deadline: '2026-01-28',
        priority: 'Medium',
        status: 'In Progress',
        attachments: {
          photos: [],
          videos: [],
          audio: [],
          notes: ''
        },
        colorTheme: 'blue'
      },
      {
        id: 6,
        name: 'Client Presentation Preparation',
        description: 'Prepare slides and demo for upcoming client presentation',
        location: 'Office - Conference Room',
        clientNumber: '+1 234-567-8906',
        deadline: '2026-01-19',
        priority: 'High',
        status: 'Pending',
        attachments: {
          photos: [],
          videos: [],
          audio: [],
          notes: ''
        },
        colorTheme: 'peach'
      },
      {
        id: 7,
        name: 'User Feedback Analysis',
        description: 'Analyze user feedback from recent product launch',
        location: 'Remote',
        clientNumber: '+1 234-567-8907',
        deadline: '2026-01-30',
        priority: 'Low',
        status: 'Pending',
        attachments: {
          photos: [],
          videos: [],
          audio: [],
          notes: ''
        },
        colorTheme: 'mint'
      },
      {
        id: 8,
        name: 'Performance Optimization',
        description: 'Optimize application performance and reduce load times',
        location: 'Remote',
        clientNumber: '+1 234-567-8908',
        deadline: '2026-01-26',
        priority: 'Medium',
        status: 'In Progress',
        attachments: {
          photos: [],
          videos: [],
          audio: [],
          notes: ''
        },
        colorTheme: 'lavender'
      }
    ];

    this.filteredTasks = [...this.tasks];
    this.updatePagination();
  }

  // Status and Priority Classes
  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-in-progress';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  }

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

  // Modal Functions
  openUpdateModal(task: Task): void {
    this.selectedTask = task;
    this.isUpdateModalOpen = true;
    this.taskUpdate = {
      photos: [],
      videos: [],
      audio: [],
      notes: task.attachments.notes || ''
    };
    this.photoPreviewUrls = [];
    this.videoPreviewUrls = [];
    this.audioPreviewUrls = [];
    this.resetMediaStates();
    document.body.style.overflow = 'hidden';
  }

  closeUpdateModal(): void {
    this.stopAllMediaCapture();
    this.isUpdateModalOpen = false;
    this.selectedTask = null;
    this.taskUpdate = {
      photos: [],
      videos: [],
      audio: [],
      notes: ''
    };
    this.photoPreviewUrls = [];
    this.videoPreviewUrls = [];
    this.audioPreviewUrls = [];
    this.resetMediaStates();
    document.body.style.overflow = 'auto';
  }

  private resetMediaStates(): void {
    this.isRecordingAudio = false;
    this.isRecordingVideo = false;
    this.isCameraActive = false;
    this.audioRecordingTime = 0;
    this.videoRecordingTime = 0;
  }

  private stopAllMediaCapture(): void {
    if (this.isRecordingAudio) {
      this.stopAudioRecording();
    }
    if (this.isRecordingVideo) {
      this.stopVideoRecording();
    }
    if (this.isCameraActive) {
      this.stopCamera();
    }
  }

  // ========== CAMERA PHOTO CAPTURE ==========
  async capturePhoto(): Promise<void> {
    try {
      if (!this.isCameraActive) {
        this.cameraStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        this.isCameraActive = true;
        
        // Display camera preview
        const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
        if (videoElement) {
          videoElement.srcObject = this.cameraStream;
          videoElement.play();
        }
      } else {
        // Capture the photo
        const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const context = canvas.getContext('2d');
        
        if (context) {
          context.drawImage(videoElement, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
              this.taskUpdate.photos.push(file);
              this.photoPreviewUrls.push(URL.createObjectURL(blob));
            }
          }, 'image/jpeg');
        }
        
        this.stopCamera();
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  }

  stopCamera(): void {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => track.stop());
      this.cameraStream = null;
    }
    this.isCameraActive = false;
    
    const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
    if (videoElement) {
      videoElement.srcObject = null;
    }
  }

  // ========== AUDIO RECORDING ==========
  async startAudioRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const file = new File([audioBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
        this.taskUpdate.audio.push(file);
        this.audioPreviewUrls.push(URL.createObjectURL(audioBlob));
        
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecordingAudio = true;
      this.audioRecordingTime = 0;
      
      this.recordingInterval = setInterval(() => {
        this.audioRecordingTime++;
      }, 1000);
    } catch (error) {
      console.error('Microphone access error:', error);
      alert('Unable to access microphone. Please ensure you have granted microphone permissions.');
    }
  }

  stopAudioRecording(): void {
    if (this.mediaRecorder && this.isRecordingAudio) {
      this.mediaRecorder.stop();
      this.isRecordingAudio = false;
      
      if (this.recordingInterval) {
        clearInterval(this.recordingInterval);
        this.recordingInterval = null;
      }
    }
  }

  // ========== VIDEO RECORDING ==========
  async startVideoRecording(): Promise<void> {
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      });
      
      // Display video preview
      const videoElement = document.getElementById('videoPreview') as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = this.videoStream;
        videoElement.play();
      }

      this.videoRecorder = new MediaRecorder(this.videoStream);
      this.videoChunks = [];

      this.videoRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.videoChunks.push(event.data);
        }
      };

      this.videoRecorder.onstop = () => {
        const videoBlob = new Blob(this.videoChunks, { type: 'video/webm' });
        const file = new File([videoBlob], `video_${Date.now()}.webm`, { type: 'video/webm' });
        this.taskUpdate.videos.push(file);
        this.videoPreviewUrls.push(URL.createObjectURL(videoBlob));
        
        this.videoStream?.getTracks().forEach(track => track.stop());
        this.videoStream = null;
        
        if (videoElement) {
          videoElement.srcObject = null;
        }
      };

      this.videoRecorder.start();
      this.isRecordingVideo = true;
      this.videoRecordingTime = 0;
      
      this.recordingInterval = setInterval(() => {
        this.videoRecordingTime++;
      }, 1000);
    } catch (error) {
      console.error('Camera/Microphone access error:', error);
      alert('Unable to access camera and microphone. Please ensure you have granted the necessary permissions.');
    }
  }

  stopVideoRecording(): void {
    if (this.videoRecorder && this.isRecordingVideo) {
      this.videoRecorder.stop();
      this.isRecordingVideo = false;
      
      if (this.recordingInterval) {
        clearInterval(this.recordingInterval);
        this.recordingInterval = null;
      }
    }
  }

  // ========== FORMAT RECORDING TIME ==========
  formatRecordingTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // ========== FILE UPLOAD HANDLERS (FALLBACK) ==========
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          this.taskUpdate.photos.push(file);
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            this.photoPreviewUrls.push(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        if (file.type.startsWith('video/')) {
          this.taskUpdate.videos.push(file);
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            this.videoPreviewUrls.push(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach(file => {
        if (file.type.startsWith('audio/')) {
          this.taskUpdate.audio.push(file);
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            this.audioPreviewUrls.push(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removePhoto(index: number): void {
    this.taskUpdate.photos.splice(index, 1);
    this.photoPreviewUrls.splice(index, 1);
  }

  removeVideo(index: number): void {
    this.taskUpdate.videos.splice(index, 1);
    this.videoPreviewUrls.splice(index, 1);
  }

  removeAudio(index: number): void {
    this.taskUpdate.audio.splice(index, 1);
    this.audioPreviewUrls.splice(index, 1);
  }

  submitTaskUpdate(): void {
    if (!this.selectedTask) return;

    this.selectedTask.attachments.notes = this.taskUpdate.notes;
    
    console.log('Task Update Submitted:', {
      taskId: this.selectedTask.id,
      photos: this.taskUpdate.photos.length,
      videos: this.taskUpdate.videos.length,
      audio: this.taskUpdate.audio.length,
      notes: this.taskUpdate.notes
    });

    alert('Task updated successfully!');
    
    this.closeUpdateModal();
  }

  // Pagination Methods
  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredTasks.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTasks = this.filteredTasks.slice(startIndex, endIndex);
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

  formatDeadline(deadline: string): string {
    const date = new Date(deadline);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }

  getDaysUntilDeadline(deadline: string): number {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  isDeadlineClose(deadline: string): boolean {
    return this.getDaysUntilDeadline(deadline) <= 3;
  }
}