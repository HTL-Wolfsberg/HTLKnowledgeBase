import { Component, OnInit } from '@angular/core';
import { FileService } from '../../services/file.service';
import { FileModel } from '../../file-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../misc/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-editor-page',
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss'
})
export class EditorPageComponent {

}
