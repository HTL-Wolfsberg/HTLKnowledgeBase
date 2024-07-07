import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: any[] = [];
  filterTags: string[] = [];

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.getFiles();
  }

  onTagsChange(event: any) {
    this.filterTags = event.target.value.split(',').map((tag: string) => tag.trim());
  }

  getFiles() {
    this.fileService.getFiles(this.filterTags).subscribe(response => {
      this.files = response;
    });
  }

  downloadFile(fileId: number, fileName: string) {
    this.fileService.downloadFile(fileId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

}
