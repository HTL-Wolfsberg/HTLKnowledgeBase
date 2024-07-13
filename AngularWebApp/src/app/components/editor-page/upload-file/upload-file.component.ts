import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent {
  file: File | null = null;
  tags: string[] = [];

  constructor(private fileService: FileService,
    private snackBar: MatSnackBar) { }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  onTagsChange(event: any) {
    this.tags = event.target.value.split(',').map((tag: string) => tag.trim());
  }

  uploadFile() {
    if (this.file && this.tags.length > 0) {
      this.fileService.uploadFile(this.file, this.tags).subscribe(response => {
        this.snackBar.open('File uploaded successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, error => {
        console.error('Error uploading file', error);
        this.snackBar.open('Error uploading file', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      });
    }
  }
}
