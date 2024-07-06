import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: any[] = [];
  filterTags: string = '';

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.getFiles();
  }

  getFiles() {
    this.fileService.getFiles(this.filterTags).subscribe(response => {
      this.files = response;
    });
  }

  downloadFile(id: number) {
    this.fileService.downloadFile(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'file';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
