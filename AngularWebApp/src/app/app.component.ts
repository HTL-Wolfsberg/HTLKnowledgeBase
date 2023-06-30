import { HttpResponse, HttpUrlEncodingCodec } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DocumentService } from './document/document.service';
import { Document } from './document/document.model';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { RoutingPaths } from './routing-paths';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

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
    private router: Router) { }

  ngOnInit(): void { }

  onNavigateToSearchClicked() {
    this.router.navigate([RoutingPaths.searchPath]);
  }

  onNavigateToManageClicked() {
    this.router.navigate([RoutingPaths.managePath]);
  }
}
