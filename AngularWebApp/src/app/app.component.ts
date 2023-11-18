import { HttpClient, HttpResponse, HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DocumentService } from './document/document.service';
import { Document } from './document/document.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { RoutingPaths } from './routing-paths';
import { MsalService } from '@azure/msal-angular';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  accountInfo?: AccountInfo;

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
    private router: Router,
    private msalService: MsalService,
    private httpclient:HttpClient) { }

  ngOnInit(): void {
    this.msalService.initialize().subscribe(()=>{
      this.accountInfo = this.msalService.instance.getActiveAccount() ?? undefined;
      console.log(this.accountInfo)
      // this.callProfile()
    })
  

  }

  callProfile () {
    this.httpclient.get("https://graph.microsoft.com/v1.0/me").subscribe( resp  => {
      console.log(resp)
    })
  }

  onNavigateToSearchClicked() {
    this.router.navigate([RoutingPaths.searchPath]);
  }

  onNavigateToManageClicked() {
    this.router.navigate([RoutingPaths.managePath]);
  }





  onLoginClicked() {
    this.msalService.loginPopup().subscribe((t) => {
      this.msalService.instance.setActiveAccount(t.account)
      this.accountInfo = this.msalService.instance.getActiveAccount() ?? undefined;
    });
  }

  onLogoutClicked(){
    this.msalService.logoutPopup().subscribe(()=>{
      this.msalService.instance.setActiveAccount(null);
      this.accountInfo = undefined;
    })
  }
}
