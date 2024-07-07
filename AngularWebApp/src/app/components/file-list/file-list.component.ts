import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { TagService } from '../../services/tag.service';
import { FileModel } from '../../file-model';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  selectedFilterTags: string[] = [];
  availaibleFilterTags: string[] = [];

  fileModels: FileModel[] = [];  // Replace `any` with your file type
  filteredFileModels: FileModel[] = [];  // Replace `any` with your file type

  constructor(private fileService: FileService,
    private tagService: TagService) { }

  ngOnInit() {
    this.fetchFiles();
    this.tagService.getFilters().subscribe((data: string[]) => {
      this.availaibleFilterTags = data;
    });
  }


  onFilterChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(target.selectedOptions).map(option => option.value);
    this.selectedFilterTags = selectedOptions;
    this.filterFiles();
  }

  filterFiles(): void {
    if (this.selectedFilterTags.length > 0) {
      this.filteredFileModels = this.fileModels.filter(fileModel =>
        this.selectedFilterTags.every(filter => fileModel.tagNameList.includes(filter))
      );
    } else {
      this.filteredFileModels = [...this.fileModels];
    }
  }

  // getFiles() {
  //   this.fileService.getFiles(this.selectedFilterTags).subscribe(response => {
  //     this.fileModels = response;
  //   });
  // }

  fetchFiles(): void {
    this.fileService.getFiles(this.selectedFilterTags).subscribe((data: FileModel[]) => {
      this.fileModels = data;
      this.filteredFileModels = [...this.fileModels];
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
