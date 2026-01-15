// employee-my-tasks.component.ts
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
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

declare var MediaRecorder: any;

@Component({
  selector: 'app-employee-my-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, EmployeeSidebarComponent],
  templateUrl: './employee-my-tasks.html',
  styleUrls: ['./employee-my-tasks.css']
})
export class EmployeeMyTasksComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  paginatedTasks: Task[] = [];
  isLoading = true;

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;

  isUpdateModalOpen = false;
  selectedTask: Task | null = null;
  taskUpdate: TaskUpdate = {
    photos: [],
    videos: [],
    audio: [],
    notes: ''
  };

  photoPreviewUrls: string[] = [];
  videoPreviewUrls: string[] = [];
  audioPreviewUrls: string[] = [];

  isRecordingAudio = false;
  isRecordingVideo = false;
  isCameraActive = false;
  audioRecordingTime = 0;
  videoRecordingTime = 0;

  private mediaRecorder: any = null;
  private videoRecorder: any = null;
  private audioChunks: Blob[] = [];
  private videoChunks: Blob[] = [];
  private recordingInterval: any = null;
  private cameraStream: MediaStream | null = null;
  private videoStream: MediaStream | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.checkBrowserSupport();
    this.loadTasks();
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.stopAllMediaCapture();
    this.cleanupPreviewUrls();
  }

  private checkBrowserSupport(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.warn('getUserMedia is not supported in this browser');
    }
    if (typeof MediaRecorder === 'undefined') {
      console.warn('MediaRecorder is not supported in this browser');
    }
  }

  private loadTasks(): void {
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
        attachments: { photos: [], videos: [], audio: [], notes: '' },
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
        attachments: { photos: [], videos: [], audio: [], notes: '' },
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
        attachments: { photos: [], videos: [], audio: [], notes: '' },
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
        attachments: { photos: [], videos: [], audio: [], notes: '' },
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
        attachments: { photos: [], videos: [], audio: [], notes: '' },
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
        attachments: { photos: [], videos: [], audio: [], notes: '' },
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
        attachments: { photos: [], videos: [], audio: [], notes: '' },
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
        attachments: { photos: [], videos: [], audio: [], notes: '' },
        colorTheme: 'lavender'
      }
    ];

    this.onSearch();
  }

  searchQuery: string = '';

  onSearch(): void {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      this.filteredTasks = this.tasks.filter(task =>
        task.name.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.location.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query)
      );
    } else {
      this.filteredTasks = [...this.tasks];
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.onSearch();
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Completed': 'status-completed',
      'In Progress': 'status-in-progress',
      'Pending': 'status-pending'
    };
    return classes[status] || '';
  }

  getPriorityClass(priority: string): string {
    const classes: { [key: string]: string } = {
      'High': 'priority-high',
      'Medium': 'priority-medium',
      'Low': 'priority-low'
    };
    return classes[priority] || '';
  }

  openUpdateModal(task: Task): void {
    this.selectedTask = task;
    this.isUpdateModalOpen = true;
    this.taskUpdate = {
      photos: [],
      videos: [],
      audio: [],
      notes: task.attachments.notes || ''
    };
    this.cleanupPreviewUrls();
    this.photoPreviewUrls = [];
    this.videoPreviewUrls = [];
    this.audioPreviewUrls = [];
    this.resetMediaStates();
    document.body.style.overflow = 'hidden';
  }

  closeUpdateModal(): void {
    this.stopAllMediaCapture();
    this.cleanupPreviewUrls();
    this.isUpdateModalOpen = false;
    this.selectedTask = null;
    this.taskUpdate = { photos: [], videos: [], audio: [], notes: '' };
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
    if (this.isRecordingAudio) this.stopAudioRecording();
    if (this.isRecordingVideo) this.stopVideoRecording();
    if (this.isCameraActive) this.stopCamera();
  }

  private cleanupPreviewUrls(): void {
    [...this.photoPreviewUrls, ...this.videoPreviewUrls, ...this.audioPreviewUrls].forEach(url => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  }

  // ========== CAMERA PHOTO CAPTURE ==========
  async capturePhoto(): Promise<void> {
    this.ngZone.run(async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert('Camera is not supported in your browser. Please use "Upload from Files" instead.');
          return;
        }

        if (!this.isCameraActive) {
          console.log('Opening camera...');
          
          this.cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          });
          
          this.isCameraActive = true;
          console.log('Camera stream obtained');

          setTimeout(() => {
            const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
            if (videoElement && this.cameraStream) {
              videoElement.srcObject = this.cameraStream;
              videoElement.onloadedmetadata = () => {
                videoElement.play()
                  .then(() => console.log('Camera preview playing'))
                  .catch(err => console.error('Error playing camera:', err));
              };
            }
          }, 100);
        } else {
          console.log('Capturing photo...');
          const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
          
          if (!videoElement || !videoElement.videoWidth || videoElement.videoWidth === 0) {
            alert('Camera not ready. Please wait a moment and try again.');
            return;
          }

          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          const context = canvas.getContext('2d');

          if (context) {
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const timestamp = new Date().getTime();
                const file = new File([blob], `photo_${timestamp}.jpg`, { type: 'image/jpeg' });
                
                this.ngZone.run(() => {
                  this.taskUpdate.photos.push(file);
                  this.photoPreviewUrls.push(URL.createObjectURL(blob));
                  console.log('Photo captured:', file.name, file.size, 'bytes');
                  alert('Photo captured successfully!');
                });
              }
            }, 'image/jpeg', 0.92);
          }

          this.stopCamera();
        }
      } catch (error: any) {
        console.error('Camera error:', error);
        let errorMsg = 'Unable to access camera. ';
        
        if (error.name === 'NotAllowedError') {
          errorMsg += 'Please grant camera permissions in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMsg += 'No camera found on your device.';
        } else if (error.name === 'NotReadableError') {
          errorMsg += 'Camera is already in use by another application.';
        } else {
          errorMsg += 'Please try "Upload from Files" instead.';
        }
        
        alert(errorMsg);
        this.stopCamera();
      }
    });
  }

  stopCamera(): void {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped');
      });
      this.cameraStream = null;
    }
    this.isCameraActive = false;

    const videoElement = document.getElementById('cameraPreview') as HTMLVideoElement;
    if (videoElement) {
      videoElement.srcObject = null;
      videoElement.pause();
    }
  }

  // ========== AUDIO RECORDING ==========
  async startAudioRecording(): Promise<void> {
    this.ngZone.run(async () => {
      try {
        if (!navigator.mediaDevices || typeof MediaRecorder === 'undefined') {
          alert('Audio recording is not supported in your browser. Please use "Upload from Files" instead.');
          return;
        }

        console.log('Starting audio recording...');
        
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        let mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/ogg';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              mimeType = '';
            }
          }
        }

        const options = mimeType ? { mimeType } : {};
        this.mediaRecorder = new MediaRecorder(stream, options);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event: any) => {
          if (event.data && event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          
          let extension = 'webm';
          if (mimeType.includes('mp4')) extension = 'mp4';
          else if (mimeType.includes('ogg')) extension = 'ogg';
          
          const timestamp = new Date().getTime();
          const file = new File([audioBlob], `audio_${timestamp}.${extension}`, { type: mimeType });
          
          this.ngZone.run(() => {
            this.taskUpdate.audio.push(file);
            this.audioPreviewUrls.push(URL.createObjectURL(audioBlob));
            console.log('Audio recorded:', file.name, file.size, 'bytes');
            alert('Audio recorded successfully!');
          });

          stream.getTracks().forEach(track => track.stop());
          this.mediaRecorder = null;
        };

        this.mediaRecorder.start();
        this.isRecordingAudio = true;
        this.audioRecordingTime = 0;

        this.recordingInterval = setInterval(() => {
          this.ngZone.run(() => {
            this.audioRecordingTime++;
          });
        }, 1000);

        console.log('Audio recording started');
      } catch (error: any) {
        console.error('Microphone error:', error);
        let errorMsg = 'Unable to access microphone. ';
        
        if (error.name === 'NotAllowedError') {
          errorMsg += 'Please grant microphone permissions in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMsg += 'No microphone found on your device.';
        } else {
          errorMsg += 'Please try "Upload from Files" instead.';
        }
        
        alert(errorMsg);
        this.isRecordingAudio = false;
      }
    });
  }

  stopAudioRecording(): void {
    if (this.mediaRecorder && this.isRecordingAudio) {
      console.log('Stopping audio recording...');
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
    this.ngZone.run(async () => {
      try {
        if (!navigator.mediaDevices || typeof MediaRecorder === 'undefined') {
          alert('Video recording is not supported in your browser. Please use "Upload from Files" instead.');
          return;
        }

        console.log('Starting video recording...');
        
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: true
        });

        setTimeout(() => {
          const videoElement = document.getElementById('videoPreview') as HTMLVideoElement;
          if (videoElement && this.videoStream) {
            videoElement.srcObject = this.videoStream;
            videoElement.muted = true;
            videoElement.onloadedmetadata = () => {
              videoElement.play()
                .then(() => console.log('Video preview playing'))
                .catch(err => console.error('Error playing video:', err));
            };
          }
        }, 100);

        let mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }

        const options = mimeType ? { mimeType } : {};
        this.videoRecorder = new MediaRecorder(this.videoStream, options);
        this.videoChunks = [];

        this.videoRecorder.ondataavailable = (event: any) => {
          if (event.data && event.data.size > 0) {
            this.videoChunks.push(event.data);
          }
        };

        this.videoRecorder.onstop = () => {
          const mimeType = this.videoRecorder?.mimeType || 'video/webm';
          const videoBlob = new Blob(this.videoChunks, { type: mimeType });
          const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
          const timestamp = new Date().getTime();
          const file = new File([videoBlob], `video_${timestamp}.${extension}`, { type: mimeType });
          
          this.ngZone.run(() => {
            this.taskUpdate.videos.push(file);
            this.videoPreviewUrls.push(URL.createObjectURL(videoBlob));
            console.log('Video recorded:', file.name, file.size, 'bytes');
            alert('Video recorded successfully!');
          });

          this.videoStream?.getTracks().forEach(track => track.stop());
          this.videoStream = null;

          const videoElement = document.getElementById('videoPreview') as HTMLVideoElement;
          if (videoElement) {
            videoElement.srcObject = null;
            videoElement.pause();
          }

          this.videoRecorder = null;
        };

        this.videoRecorder.start();
        this.isRecordingVideo = true;
        this.videoRecordingTime = 0;

        this.recordingInterval = setInterval(() => {
          this.ngZone.run(() => {
            this.videoRecordingTime++;
          });
        }, 1000);

        console.log('Video recording started');
      } catch (error: any) {
        console.error('Camera/Microphone error:', error);
        let errorMsg = 'Unable to access camera and microphone. ';
        
        if (error.name === 'NotAllowedError') {
          errorMsg += 'Please grant camera and microphone permissions in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMsg += 'No camera or microphone found on your device.';
        } else if (error.name === 'NotReadableError') {
          errorMsg += 'Camera or microphone is already in use by another application.';
        } else {
          errorMsg += 'Please try "Upload from Files" instead.';
        }
        
        alert(errorMsg);
        this.isRecordingVideo = false;
        
        if (this.videoStream) {
          this.videoStream.getTracks().forEach(track => track.stop());
          this.videoStream = null;
        }
      }
    });
  }

  stopVideoRecording(): void {
    if (this.videoRecorder && this.isRecordingVideo) {
      console.log('Stopping video recording...');
      this.videoRecorder.stop();
      this.isRecordingVideo = false;

      if (this.recordingInterval) {
        clearInterval(this.recordingInterval);
        this.recordingInterval = null;
      }
    }
  }

  formatRecordingTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // ========== FILE UPLOAD HANDLERS ==========
  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          this.taskUpdate.photos.push(file);
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
              this.ngZone.run(() => {
                this.photoPreviewUrls.push(e.target!.result as string);
              });
            }
          };
          reader.readAsDataURL(file);
          console.log('Photo uploaded:', file.name, file.size, 'bytes');
        }
      });
      input.value = '';
    }
  }

  onVideoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        if (file.type.startsWith('video/')) {
          this.taskUpdate.videos.push(file);
          this.ngZone.run(() => {
            this.videoPreviewUrls.push(URL.createObjectURL(file));
          });
          console.log('Video uploaded:', file.name, file.size, 'bytes');
        }
      });
      input.value = '';
    }
  }

  onAudioSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach(file => {
        if (file.type.startsWith('audio/')) {
          this.taskUpdate.audio.push(file);
          this.ngZone.run(() => {
            this.audioPreviewUrls.push(URL.createObjectURL(file));
          });
          console.log('Audio uploaded:', file.name, file.size, 'bytes');
        }
      });
      input.value = '';
    }
  }

  removePhoto(index: number): void {
    if (this.photoPreviewUrls[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(this.photoPreviewUrls[index]);
    }
    this.taskUpdate.photos.splice(index, 1);
    this.photoPreviewUrls.splice(index, 1);
    console.log('Photo removed');
  }

  removeVideo(index: number): void {
    if (this.videoPreviewUrls[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(this.videoPreviewUrls[index]);
    }
    this.taskUpdate.videos.splice(index, 1);
    this.videoPreviewUrls.splice(index, 1);
    console.log('Video removed');
  }

  removeAudio(index: number): void {
    if (this.audioPreviewUrls[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(this.audioPreviewUrls[index]);
    }
    this.taskUpdate.audio.splice(index, 1);
    this.audioPreviewUrls.splice(index, 1);
    console.log('Audio removed');
  }

  submitTaskUpdate(): void {
    if (!this.selectedTask) return;

    this.stopAllMediaCapture();
    this.selectedTask.attachments.notes = this.taskUpdate.notes;

    console.log('\n========== TASK UPDATE SUBMITTED ==========');
    console.log('Task ID:', this.selectedTask.id);
    console.log('Task Name:', this.selectedTask.name);
    console.log('\n📸 Photos:', this.taskUpdate.photos.length);
    this.taskUpdate.photos.forEach((photo, i) => {
      console.log(`  ${i + 1}. ${photo.name} (${(photo.size / 1024).toFixed(2)} KB)`);
    });
    console.log('\n🎥 Videos:', this.taskUpdate.videos.length);
    this.taskUpdate.videos.forEach((video, i) => {
      console.log(`  ${i + 1}. ${video.name} (${(video.size / 1024 / 1024).toFixed(2)} MB)`);
    });
    console.log('\n🎤 Audio:', this.taskUpdate.audio.length);
    this.taskUpdate.audio.forEach((audio, i) => {
      console.log(`  ${i + 1}. ${audio.name} (${(audio.size / 1024).toFixed(2)} KB)`);
    });
    console.log('\n📝 Notes:', this.taskUpdate.notes || '(empty)');
    console.log('==========================================\n');

    // Prepare FormData for backend
    const formData = new FormData();
    formData.append('taskId', this.selectedTask.id.toString());
    
    this.taskUpdate.photos.forEach((photo) => {
      formData.append('photos', photo, photo.name);
    });
    
    this.taskUpdate.videos.forEach((video) => {
      formData.append('videos', video, video.name);
    });
    
    this.taskUpdate.audio.forEach((audio) => {
      formData.append('audio', audio, audio.name);
    });
    
    formData.append('notes', this.taskUpdate.notes);

    // Send to backend API
    // Example: this.http.post('/api/tasks/update', formData).subscribe(...)

    const summary = `Task Updated Successfully!\n\n📸 Photos: ${this.taskUpdate.photos.length}\n🎥 Videos: ${this.taskUpdate.videos.length}\n🎤 Audio: ${this.taskUpdate.audio.length}\n📝 Notes: ${this.taskUpdate.notes ? 'Added' : 'None'}`;
    alert(summary);

    this.closeUpdateModal();
  }

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