import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DocumentService } from 'src/app/document.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent {

  constructor(private documentService: DocumentService,
    private messageService: MessageService,
    private router: Router) { }

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
    });
  }

  showToastSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary: summary, detail: detail });
  }

}
