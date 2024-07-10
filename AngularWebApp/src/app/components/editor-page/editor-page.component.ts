import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileModel } from '../../file-model';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss'
})
export class EditorPageComponent implements OnInit {
  files: FileModel[] = [];

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.fileService.getFilesFromUser().subscribe(files => {
      this.files = files;
      console.log(files)
    });
  }
}
