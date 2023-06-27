import { HttpResponse, HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DocumentService } from './document.service';
import { Document } from './document.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { RoutingPaths } from './routing-paths';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  documents: Document[] = [];
  selectedDocument?: Document;

  items = [
    {
      label: 'Suche',
      icon: 'pi pi-search',
      command: () => {
        this.onNavigateToSearchClicked();
      }
    },
    {
      label: 'Verwalten',
      icon: 'pi pi-upload',
      command: () => {
        this.onNavigateToManageClicked();
      }
    }
  ]

  constructor(private documentService: DocumentService,
    private messageService: MessageService,
    private router:Router) { }

  ngOnInit(): void {
    this.getDocumentsWithOnlyMetaData();
  }

  onNavigateToSearchClicked(){
    this.router.navigate([RoutingPaths.searchPath]);
  }

  onNavigateToManageClicked(){
    this.router.navigate([RoutingPaths.managePath]);
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

  OnBtnUploadClicked(event: Event) {
    if (!event)
      return;

    const target = event.target as HTMLInputElement;

    if (!target.files)
      return;

    const file = target.files[0];

    const formData = new FormData();
    formData.append('file', file, file.name);

    this.documentService.postDocument(formData).subscribe((response) => {
      this.showToastSuccess("Erfolgreich hochgeladen", "Die Datei " + file.name + " wurde hochgeladen");
      this.getDocumentsWithOnlyMetaData();
    });
  }

  showToastSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary: summary, detail: detail });
  }

}
