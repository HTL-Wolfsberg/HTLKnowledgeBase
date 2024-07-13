import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from '../../../services/file.service';
import { TagService } from '../../../services/tag.service';
import { TagModel } from '../../../tag-model';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  file: File | null = null;
  selectedTags: TagModel[] = [];
  availableTags: TagModel[] = [];

  constructor(
    private fileService: FileService,
    private tagService: TagService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.fetchTags();
  }

  fetchTags() {
    this.tagService.getTags().subscribe(tags => {
      this.availableTags = tags;
    });
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile() {
    if (this.file && this.selectedTags.length > 0) {
      this.fileService.uploadFile(this.file, this.selectedTags).subscribe(response => {
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
