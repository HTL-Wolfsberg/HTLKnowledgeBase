import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileModel } from '../../../file-model';
import { ConfirmDialogComponent } from '../../../misc/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.scss']
})
export class EditFileComponent implements OnInit {
  files: FileModel[] = [];
  filteredFiles: FileModel[] = [];
  filterText: string = '';
  editingFileId: string | null = null;  // Track the currently edited file

  displayedColumns: string[] = ['name', 'size', 'type', 'tags', 'actions'];

  constructor(private fileService: FileService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.fetchFiles();
  }

  fetchFiles() {
    this.fileService.getFilesFromUser().subscribe(files => {
      this.files = files;
      this.filterFiles();
    });
  }

  filterFiles() {
    const filterTextLower = this.filterText.toLowerCase();
    this.filteredFiles = this.files.filter(file =>
      file.name.toLowerCase().includes(filterTextLower) ||
      file.type.toLowerCase().includes(filterTextLower) ||
      file.tagList.some(tag => tag.name.toLowerCase().includes(filterTextLower))
    );
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
      this.filterFiles();

    }, error => {
      console.error('Error removing file', error);
      this.snackBar.open('Error removing file', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

  toggleEdit(fileId: string) {
    if (this.editingFileId === fileId) {
      this.editingFileId = null;
    } else {
      this.editingFileId = fileId;
    }
  }

  isEditing(fileId: string): boolean {
    return this.editingFileId === fileId;
  }

  onFileNameChange(file: FileModel) {
    this.fileService.updateFile(file).subscribe(response => {
      this.snackBar.open('File name updated successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }, error => {
      console.error('Error updating file name', error);
      this.snackBar.open('Error updating file name', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

  removeTag(file: FileModel, tag: any) {
    const index = file.tagList.indexOf(tag);
    if (index >= 0) {
      file.tagList.splice(index, 1);
      this.fileService.updateFile(file).subscribe(response => {
        this.snackBar.open('Tag removed successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      }, error => {
        console.error('Error removing tag', error);
        this.snackBar.open('Error removing tag', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      });
    }
  }

  addTag(file: FileModel) {
    // Implement modal window here to add a new tag
  }
}
