import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileService } from '../../../services/file.service';
import { TagService } from '../../../services/tag.service';
import { TagModel } from '../../../tag-model';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  file: File | null = null;
  selectedTags: TagModel[] = [];
  availableTags: TagModel[] = [];
  filteredTags: Observable<TagModel[]>;
  searchText: string = '';

  tagFilterCtrl = new FormControl();

  private _filterTags$ = new BehaviorSubject<TagModel[]>([]);

  constructor(
    private fileService: FileService,
    private tagService: TagService,
    private snackBar: MatSnackBar
  ) {
    this.filteredTags = this._filterTags$.asObservable();
  }

  ngOnInit() {
    this.tagService.getTags().subscribe((tags: TagModel[]) => {
      this.availableTags = tags;
      this._filterTags$.next(tags);
      this.tagFilterCtrl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterTags(value))
        )
        .subscribe(tags => this._filterTags$.next(tags));
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

  compareTags(t1: TagModel, t2: TagModel): boolean {
    return t1 && t2 ? t1.id === t2.id : t1 === t2;
  }

  getSelectedTagNames(): string {
    return this.selectedTags.map(tag => tag.name).join(', ');
  }

  private _filterTags(value: string): TagModel[] {
    const filterValue = value.toLowerCase();
    return this.availableTags.filter(tag => tag.name.toLowerCase().includes(filterValue));
  }

  onDropdownOpen() {
    this.tagFilterCtrl.setValue('');
    this._filterTags$.next(this.availableTags);
  }

  onDropdownClose() {
    this._filterTags$.next(this.selectedTags);
  }
}
