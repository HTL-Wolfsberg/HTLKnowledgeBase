import { Component, OnInit } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../misc/confirm-dialog/confirm-dialog.component';
import { TagService } from '../../../services/tag.service';
import { TagModel } from '../../../tag-model';


@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss']
})
export class ManageTagsComponent implements OnInit {
  tags: TagModel[] = [];

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

  onAddTagClicked(tagName: string) {
    tagName = tagName.trim();
    this.tagService.addTag({ name: tagName, id: "" }).subscribe(response => {
      this.snackBar.open('Tag added successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.fetchTags();
    }, error => {
      console.error('Error adding tag', error);
      this.snackBar.open('Error adding tag', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    });
  }

  onModifyTagClicked(tag: TagModel) {
    const newTagName = prompt('Enter new name for the tag:', tag.name);
    if (newTagName && newTagName.trim() !== '') {
      tag.name = newTagName;
      this.tagService.modifyTag(tag).subscribe(response => {
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

  onDeleteTagClicked(tag: TagModel) {
    this.tagService.getTagFileCount(tag).subscribe(fileCount => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '250px',
        data: { message: `Are you sure you want to delete this tag? ${fileCount} files will be affected.` }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.tagService.deleteTag(tag).subscribe(response => {
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
    })
  }
}
