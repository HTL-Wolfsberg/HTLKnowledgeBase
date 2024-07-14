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
  filterText: string = '';
  files: FileModel[] = [];
  filteredFiles: FileModel[] = [];

  displayedColumns: string[] = ['name', 'size', 'type', 'tags', 'actions'];

  constructor(private fileService: FileService, private tagService: TagService) { }

  ngOnInit() {
    this.fetchFiles();
  }

  fetchFiles() {
    this.fileService.getFiles([]).subscribe(files => {
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
