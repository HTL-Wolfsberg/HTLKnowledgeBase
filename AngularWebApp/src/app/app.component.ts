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
   this.documentService.Get("4d23854b-4854-463f-9ac3-f7dd20933ed8").subscribe( document =>{
    console.log(document)

    let blob = new Blob([document], {type: "application/png"});

    //var downloadURL = window.URL.createObjectURL(data);

    const url= window.URL.createObjectURL(blob);
    window.open(url);
   });
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

    const formData = new FormData();
    formData.append('file', file, file.name);

    this.documentService.postDocument(formData).subscribe((response)=>{
      console.log(response);
    });
  }
}
