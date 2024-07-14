import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TagService } from '../../services/tag.service';
import { TagModel } from '../../tag-model';
import { FileModel } from '../../file-model';

@Component({
  selector: 'app-add-tag-dialog',
  templateUrl: './add-tag-dialog.component.html',
  styleUrls: ['./add-tag-dialog.component.scss']
})
export class AddTagDialogComponent implements OnInit {
  selectedTags: TagModel[] = [];
  availableTags: TagModel[] = [];
  filteredTags: Observable<TagModel[]>;
  tagFilterCtrl = new FormControl();

  private _filterTags$ = new BehaviorSubject<TagModel[]>([]);

  constructor(
    public dialogRef: MatDialogRef<AddTagDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tagService: TagService
  ) {
    this.filteredTags = this._filterTags$.asObservable();
  }

  ngOnInit() {
    this.tagService.getTags().subscribe((tags: TagModel[]) => {
      this.availableTags = tags;
      this._filterTags$.next(tags);
      this.selectedTags = (this.data.file as FileModel).tagList
      this.tagFilterCtrl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterTags(value))
        )
        .subscribe(tags => this._filterTags$.next(tags));
    });
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

  onCancel(): void {
    this.dialogRef.close();
  }

  onAddTags(): void {
    this.dialogRef.close(this.selectedTags);
  }
}
