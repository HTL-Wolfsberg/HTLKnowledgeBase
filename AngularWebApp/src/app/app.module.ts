import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { SearchComponent } from './search/search/search.component';
import { ManageComponent } from './manage/manage/manage.component';
import { ChipModule } from 'primeng/chip';
import { InputTextModule } from 'primeng/inputtext';
import { MsalModule, MsalService, MSAL_INSTANCE, MsalInterceptor, MSAL_INTERCEPTOR_CONFIG, MsalInterceptorConfiguration, ProtectedResourceScopes } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, PublicClientApplication } from '@azure/msal-browser';
import { ApiService } from './api.service';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: "6085ae93-5c1f-4355-8345-cb8b2387364a",
      redirectUri: "http://localhost:4200",
      postLogoutRedirectUri: "http://localhost:4200"
    }, cache: {
      cacheLocation: "localStorage",

    },
  })
}

// provides authRequest configuration
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string | ProtectedResourceScopes> | null>([
    ["http://127.0.0.1:5244/", [
      {
        httpMethod: "*",
        scopes: ["*"]
      }
    ]]
  ])


  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ManageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    BrowserAnimationsModule,
    ToastModule,
    MenuModule,
    ChipModule,
    InputTextModule,
    MsalModule,

  ],
  providers: [
    MessageService,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalService],

  bootstrap: [AppComponent]
})
export class AppModule {


}
