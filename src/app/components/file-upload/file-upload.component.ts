import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  imports: [FormsModule, NgIf, NgFor]
})
export class FileUploadComponent implements OnInit {
  private baseUrl = 'http://localhost:8080/api/file';

  description = '';
  entityType: 'postId' | 'notificationId' | 'messageId' | 'teachingMaterialId' | 'evaluationInstrumentId' = 'postId';
  entityId: number | null = null;
  selectedFile: File | null = null;

  files: any[] = []; 

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    this.http.get<any[]>(this.baseUrl).subscribe({
      next: (res) => (this.files = res),
      error: (err) => console.error('Failed to load files', err),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  upload() {
    if (!this.selectedFile || !this.entityId) {
      alert('Select a file and enter an entity ID first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('description', this.description);
    formData.append(this.entityType, String(this.entityId));

    this.http.post<any>(`${this.baseUrl}/upload`, formData).subscribe({
      next: (res) => {
        console.log('Upload success:', res);
        this.loadFiles(); 
        this.resetForm();
      },
      error: (err) => console.error('Upload failed', err),
    });
  }

  download(id: number) {
    window.open(`${this.baseUrl}/download/${id}`, '_blank');
  }

  delete(id: number) {
    this.http.delete(`${this.baseUrl}/${id}`).subscribe({
      next: () => this.loadFiles(),
      error: (err) => console.error('Delete failed', err),
    });
  }

  private resetForm() {
    this.description = '';
    this.entityId = null;
    this.selectedFile = null;
  }
}
