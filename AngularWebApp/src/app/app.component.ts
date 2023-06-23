import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AngularWebApp';

  OnBtnUploadClicked(event: any){
    console.log(event)

    const file = event.target.files[0]

    const formData = new FormData();
    formData.append("thumbnail", file);
  }

}
