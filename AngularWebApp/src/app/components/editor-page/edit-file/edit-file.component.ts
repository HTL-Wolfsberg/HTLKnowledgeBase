import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileModel, FileModelImpl } from '../../../file-model';
import { ConfirmDialogComponent } from '../../../misc/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../../services/file.service';
import { AddTagDialogComponent } from '../../../misc/add-tag-dialog/add-tag-dialog.component';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.scss']
})
export class EditFileComponent implements OnInit {
  files: FileModel[] = [];
  filteredFiles: FileModel[] = [];
  filterText: string = '';
  editingFile: FileModel | null = null;  // Track the currently edited file
  backupFile: FileModel | null = null; // Backup of the file before editing

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
      file.getFileNameWithoutExtension().toLowerCase().includes(filterTextLower) ||
      file.getFileExtension().toLowerCase().includes(filterTextLower) ||
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
    });
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

  toggleEdit(file: FileModel) {
    if (this.isEditing(file.id)) {
      this.saveChanges(file);
      this.editingFile = null;
      this.backupFile = null; // Clear the backup file after saving
    } else {
      this.backupFile = new FileModelImpl(JSON.parse(JSON.stringify(file))); // Create a deep copy as a backup before editing
      this.editingFile = { ...file };
    }
  }

  cancelEdit() {
    if (this.editingFile && this.backupFile) {
      const index = this.files.findIndex(f => f.id === this.editingFile!.id);
      if (index !== -1) {
        this.files[index] = this.backupFile; // Revert changes
        this.filterFiles(); // Reapply filters
      }
      this.editingFile = null;
      this.backupFile = null;
    }
  }

  isEditing(fileId: string): boolean {
    return this.editingFile !== null && this.editingFile.id === fileId;
  }

  saveChanges(file: FileModel) {
    this.fileService.updateFile(file).subscribe(response => {
      this.snackBar.open('File updated successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.fetchFiles(); // Refresh the file list
    }, error => {
      console.error('Error updating file', error);
      this.snackBar.open('Error updating file', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

  removeTag(file: FileModel, tag: any) {
    const index = file.tagList.indexOf(tag);
    if (index >= 0) {
      file.tagList.splice(index, 1);
    }
  }

  openAddTagDialog(file: FileModel) {
    const dialogRef = this.dialog.open(AddTagDialogComponent, {
      width: '400px',
      data: { file: file }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        file.tagList = result;
      }
    });
  }
}
