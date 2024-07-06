import { Component } from '@angular/core';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  file: File | null = null;
  tags: string = '';

  constructor(private fileService: FileService) { }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    if (this.file && this.tags) {
      this.fileService.uploadFile(this.file, this.tags).subscribe(response => {
        console.log('File uploaded successfully', response);
      });
    }
  }
}
