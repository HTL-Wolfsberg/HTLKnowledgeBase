import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileModel } from '../../../file-model';
import { ConfirmDialogComponent } from '../../../misc/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrl: './edit-file.component.scss'
})
export class EditFileComponent {
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

  onRemoveFileClicked(id: string) {
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

  removeFile(id: string) {
    this.fileService.deleteFile(id).subscribe(response => {
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
