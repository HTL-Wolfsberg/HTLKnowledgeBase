import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileModel, FileModelImpl } from '../../../file-model';
import { ConfirmDialogComponent } from '../../../misc/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../../services/file.service';
import { AddTagDialogComponent } from '../../../misc/add-tag-dialog/add-tag-dialog.component';
import { MatSort, Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TagModel } from '../../../tag-model';
import { TagService } from '../../../services/tag.service';

@Component({
  selector: 'app-edit-file',
  templateUrl: './edit-file.component.html',
  styleUrls: ['./edit-file.component.scss']
})
export class EditFileComponent implements OnInit {
  files: FileModel[] = [];
  filteredFiles: FileModel[] = [];
  fileNameFilter: string = '';
  fileTypeFilter: string = '';
  selectedFilterTags: TagModel[] = [];
  availableFilterTags: TagModel[] = [];
  filteredTags: Observable<TagModel[]>;
  sortedData: FileModel[] = [];
  editingFile: FileModel | null = null;  // Track the currently edited file
  backupFile: FileModel | null = null; // Backup of the file before editing

  displayedColumns: string[] = ['name', 'type', 'author', 'tags', 'size', 'created', 'modified', 'actions'];
  tagFilterCtrl = new FormControl();
  private _filterTags$ = new BehaviorSubject<TagModel[]>([]);
  @ViewChild(MatSort) sort!: MatSort; // Definite assignment assertion

  constructor(private fileService: FileService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private tagService: TagService) {
    this.filteredTags = this._filterTags$.asObservable();
  }

  ngOnInit() {
    this.fetchFiles();
    this.tagService.getTags().subscribe((tags: TagModel[]) => {
      this.availableFilterTags = tags;
      this._filterTags$.next(tags);
      this.tagFilterCtrl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterTags(value))
        )
        .subscribe(tags => this._filterTags$.next(tags));
    });
  }

  filterFiles() {
    const filterName = this.fileNameFilter.toLowerCase();
    const filterType = this.fileTypeFilter.toLowerCase();

    this.filteredFiles = this.files.filter(file => {
      const matchesName = filterName ? file.getFileNameWithoutExtension().toLowerCase().includes(filterName) : true;
      const matchesType = filterType ? file.getFileExtension().toLowerCase().includes(filterType) : true;
      const matchesTags = this.selectedFilterTags.length > 0 ? this.selectedFilterTags.every(tag => file.tagList.some(ft => ft.id === tag.id)) : true;

      return matchesName && matchesType && matchesTags;
    });

    if (this.sort) {
      this.applySort(this.sort);
    }
  }

  fetchFiles() {
    this.fileService.getFilesFromUser().subscribe(files => {
      this.files = files;
      this.filteredFiles = [...this.files];
      this.filterFiles();
    });
  }


  private _filterTags(value: string): TagModel[] {
    const filterValue = value.toLowerCase();
    return this.availableFilterTags.filter(tag => tag.name.toLowerCase().includes(filterValue));
  }

  sortData(sort: Sort) {
    this.applySort(sort);
  }

  applySort(sort: Sort) {
    if (!sort) return;

    const data = this.filteredFiles.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.getFileNameWithoutExtension(), b.getFileNameWithoutExtension(), isAsc);
        case 'size':
          return compare(a.size, b.size, isAsc);
        case 'type':
          return compare(a.getFileExtension(), b.getFileExtension(), isAsc);
        case 'author':
          return compare(a.authorName, b.authorName, isAsc);
        case 'created':
          return compare(a.created, b.created, isAsc);
        case 'modified':
          return compare(a.lastChanged, b.lastChanged, isAsc);
        default:
          return 0;
      }
    });

    this.filteredFiles = [...this.sortedData];
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

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
