import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileListComponent } from './components/file-list/file-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './auth/auth.guard';
import { EditorPageComponent } from './components/editor-page/editor-page.component';
import { EditFileComponent } from './components/editor-page/edit-file/edit-file.component';
import { ManageTagsComponent } from './components/editor-page/manage-tags/manage-tags.component';
import { UploadFileComponent } from './components/editor-page/upload-file/upload-file.component';

const routes: Routes = [
  { path: 'list', component: FileListComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'editor', component: EditorPageComponent, canActivate: [AuthGuard], children: [
      { path: '', redirectTo: 'edit', pathMatch: 'full' },
      { path: 'edit', component: EditFileComponent },
      { path: 'upload', component: UploadFileComponent },
      { path: 'tags', component: ManageTagsComponent },
    ]
  },
  { path: '', redirectTo: '/list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
