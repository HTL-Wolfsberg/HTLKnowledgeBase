import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileModel } from '../../file-model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss'
})
export class EditorPageComponent implements OnInit {
  files: FileModel[] = [];

  constructor(private fileService: FileService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.fileService.getFilesFromUser().subscribe(files => {
      this.files = files;
    });
  }

  removeFile(id: number) {
    this.fileService.deleteFile(id).subscribe(response => {
      console.log('File removed successfully', response);
      this.snackBar.open('File removed successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.files = this.files.filter(file => file.id !== id);

    }, error => {
      console.error('Error removing file', error);
      this.snackBar.open('Error removing file', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

}
