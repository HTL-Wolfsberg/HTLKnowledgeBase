import { Component, OnInit } from '@angular/core';
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
  availaibleFilterTags: TagModel[] = [];

  fileModels: FileModel[] = [];
  filteredFileModels: FileModel[] = [];

  constructor(private fileService: FileService, private tagService: TagService) { }

  ngOnInit() {
    this.fetchFiles();
    this.tagService.getTags().subscribe((tags: TagModel[]) => {
      this.availaibleFilterTags = tags;
    });
  }

  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(target.selectedOptions).map(option => option.value);
    this.selectedFilterTags = this.availaibleFilterTags.filter(tag => selectedOptions.includes(tag.name));
    this.filterFiles();
  }

  filterFiles(): void {
    this.filteredFileModels = this.fileModels.filter(fileModel => {
      const matchesName = this.fileNameFilter ? fileModel.name.toLowerCase().includes(this.fileNameFilter.toLowerCase()) : true;
      const matchesType = this.fileTypeFilter ? fileModel.type.toLowerCase().includes(this.fileTypeFilter.toLowerCase()) : true;
      const matchesTags = this.selectedFilterTags.length > 0 ? this.selectedFilterTags.every(tag => fileModel.tagList.some(ft => ft.id === tag.id)) : true;

      return matchesName && matchesType && matchesTags;
    });
  }

  fetchFiles(): void {
    this.fileService.getFiles(this.selectedFilterTags).subscribe((data: FileModel[]) => {
      this.fileModels = data;
      this.filteredFileModels = [...this.fileModels];
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
}
