import { HttpResponse, HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DocumentService } from './document.service';
import { Document } from './document.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  documents: Document[] = [];

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documentService.GetOnlyMetaData().subscribe(documents => {
      this.documents = documents;
    });
  }

  onFileSelected(event: any) {
    if (!event.value)
      return;

    let document: Document = event.value;

    this.documentService.Get(document?.guid).subscribe(document => {
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

    });
  }
}
