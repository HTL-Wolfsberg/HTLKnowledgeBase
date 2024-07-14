import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { TagService } from '../../services/tag.service';
import { FileModel } from '../../file-model';
import { TagModel } from '../../tag-model';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  fileNameFilter: string = '';
  fileTypeFilter: string = '';
  selectedFilterTags: TagModel[] = [];
  availableFilterTags: TagModel[] = [];
  filteredTags: Observable<TagModel[]>;

  files: FileModel[] = [];
  filteredFiles: FileModel[] = [];

  displayedColumns: string[] = ['name', 'size', 'type', 'tags', 'actions'];

  tagFilterCtrl = new FormControl();
  private _filterTags$ = new BehaviorSubject<TagModel[]>([]);

  constructor(private fileService: FileService, private tagService: TagService) {
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
      const matchesName = filterName ? file.name.toLowerCase().includes(filterName) : true;
      const matchesType = filterType ? file.type.toLowerCase().includes(filterType) : true;
      const matchesTags = this.selectedFilterTags.length > 0 ? this.selectedFilterTags.every(tag => file.tagList.some(ft => ft.id === tag.id)) : true;

      return matchesName && matchesType && matchesTags;
    });
  }

  fetchFiles() {
    this.fileService.getFiles([]).subscribe(files => {
      this.files = files;
      this.filterFiles();
    });
  }

  downloadFile(file: FileModel) {
    this.fileService.downloadFile(file.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  private _filterTags(value: string): TagModel[] {
    const filterValue = value.toLowerCase();
    return this.availableFilterTags.filter(tag => tag.name.toLowerCase().includes(filterValue));
  }
}
