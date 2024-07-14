import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FileService } from '../../services/file.service';
import { TagService } from '../../services/tag.service';
import { FileModel } from '../../file-model';
import { TagModel } from '../../tag-model';

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
  sortedData: FileModel[] = [];

  files: FileModel[] = [];
  filteredFiles: FileModel[] = [];
  displayedColumns: string[] = ['name', 'size', 'type', 'tags', 'actions'];
  tagFilterCtrl = new FormControl();
  private _filterTags$ = new BehaviorSubject<TagModel[]>([]);
  @ViewChild(MatSort) sort!: MatSort; // Definite assignment assertion

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

    if (this.sort) {
      this.applySort(this.sort);
    }
  }

  fetchFiles() {
    this.fileService.getFiles([]).subscribe(files => {
      this.files = files;
      this.filteredFiles = [...this.files];
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
          return compare(a.name, b.name, isAsc);
        case 'size':
          return compare(a.size, b.size, isAsc);
        case 'type':
          return compare(a.type, b.type, isAsc);
        default:
          return 0;
      }
    });

    this.filteredFiles = [...this.sortedData];
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
