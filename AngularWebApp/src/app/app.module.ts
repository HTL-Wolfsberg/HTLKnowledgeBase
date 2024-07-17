import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FileListComponent } from './components/file-list/file-list.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { EditorPageComponent } from './components/editor-page/editor-page.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './misc/confirm-dialog/confirm-dialog.component';
import { EditFileComponent } from './components/editor-page/edit-file/edit-file.component';
import { UploadFileComponent } from './components/editor-page/upload-file/upload-file.component';
import { ManageTagsComponent } from './components/editor-page/manage-tags/manage-tags.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTableModule } from '@angular/material/table';
import { AddTagDialogComponent } from './misc/add-tag-dialog/add-tag-dialog.component';
import { MatSortModule } from '@angular/material/sort';
import { AdminPageComponent } from './components/admin-page/admin-page.component';


@NgModule({
  declarations: [
    AppComponent,
    FileListComponent,
    RegisterComponent,
    LoginComponent,
    EditorPageComponent,
    ConfirmDialogComponent,
    EditFileComponent,
    UploadFileComponent,
    ManageTagsComponent,
    AddTagDialogComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatFormFieldModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule
  ],
  providers: [
    provideAnimationsAsync(),
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
