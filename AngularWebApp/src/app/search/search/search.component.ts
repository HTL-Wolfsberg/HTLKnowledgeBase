import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DocumentService } from 'src/app/document/document.service';
import { Document } from '../../document/document.model';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  documents: Document[] = [];
  selectedDocument?: Document;

  constructor(private documentService: DocumentService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit(): void {
    this.getDocumentsWithOnlyMetaData();
  }

  getDocumentsWithOnlyMetaData() {
    this.documentService.GetOnlyMetaData().subscribe(documents => {
      this.documents = documents;
    });
  }

  onFileSelected() {
    if (!this.selectedDocument)
      return;

    this.documentService.Get(this.selectedDocument.guid).subscribe(document => {
      let filename = document.headers.get("filename");
      if (!filename)
        return;

      filename = decodeURIComponent(filename);

      this.downloadFile(document, decodeURIComponent(filename));
    })
  }

  private downloadFile = (data: HttpResponse<Blob>, filename: string) => {
    if (!data.body)
      return;

    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = filename;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

}
