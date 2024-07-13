import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileModel } from '../../file-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../misc/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss'
})
export class EditorPageComponent implements OnInit {
  files: FileModel[] = [];

  constructor(private fileService: FileService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.fetchFiles();
  }

  fetchFiles() {
    this.fileService.getFilesFromUser().subscribe(files => {
      this.files = files;
    });
  }

  onRemoveFileClicked(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this file?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeFile(id);
      }
    })
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
