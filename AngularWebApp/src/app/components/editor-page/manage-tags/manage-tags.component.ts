import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../misc/confirm-dialog/confirm-dialog.component';
import { TagService } from '../../../services/tag.service';


@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss']
})
export class ManageTagsComponent implements OnInit {
  tags: string[] = []; // Replace `any` with your Tag type
  newTagName: string = '';

  constructor(private tagService: TagService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.fetchTags();
  }

  fetchTags() {
    this.tagService.getTags().subscribe(tags => {
      this.tags = tags;
    });
  }

  onAddTagClicked() {
    if (this.newTagName.trim() !== '') {
      this.tagService.addTag({ name: this.newTagName }).subscribe(response => {
        this.snackBar.open('Tag added successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.fetchTags();
        this.newTagName = '';
      }, error => {
        console.error('Error adding tag', error);
        this.snackBar.open('Error adding tag', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      });
    }
  }

  onModifyTagClicked(tag: any) {
    const newTagName = prompt('Enter new name for the tag:', tag.name);
    if (newTagName && newTagName.trim() !== '') {
      this.tagService.modifyTag(tag.id, { name: newTagName }).subscribe(response => {
        this.snackBar.open('Tag modified successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.fetchTags();
      }, error => {
        console.error('Error modifying tag', error);
        this.snackBar.open('Error modifying tag', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      });
    }
  }

  onDeleteTagClicked(tagId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this tag?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tagService.deleteTag(tagId).subscribe(response => {
          this.snackBar.open('Tag deleted successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.fetchTags();
        }, error => {
          console.error('Error deleting tag', error);
          this.snackBar.open('Error deleting tag', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        });
      }
    });
  }
}
