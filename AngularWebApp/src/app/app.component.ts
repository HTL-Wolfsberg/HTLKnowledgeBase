import { Component, OnInit } from '@angular/core';
import { DocumentService } from './document.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private documentService:DocumentService) {

  }
  ngOnInit(): void {
   this.documentService.getShit().subscribe();
  }

  OnBtnUploadClicked(event: Event) {

    if (!event)
      return;

    console.log(event.target);

    const target = event.target as HTMLInputElement;

    if (!target)
      return;

    if (!target.files)
      return;

    const file = target.files[0];

    console.log(file);

    const formData = new FormData();
    formData.append('file', file, file.name);

    this.documentService.postDocument(formData).subscribe((response)=>{
      console.log(response);
    });
  }
}
