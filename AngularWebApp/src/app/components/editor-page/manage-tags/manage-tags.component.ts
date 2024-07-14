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
  filteredTags: TagModel[] = [];
  filterText: string = '';

  constructor(private tagService: TagService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.fetchTags();
  }

  fetchTags() {
    this.tagService.getTags().subscribe(tags => {
      this.tags = tags;
      this.filterTags(); // Initialize the filtered tags
    });
  }

  filterTags() {
    const filterTextLower = this.filterText.toLowerCase();
    this.filteredTags = this.tags.filter(tag => tag.name.toLowerCase().includes(filterTextLower));
  }

  onAddTagClicked(tagName: string) {
    tagName = tagName.trim();
    if (tagName.length <= 0) {
      this.showError("Tag Name empty");
      return;
    }
    this.tagService.addTag({ name: tagName, id: "" }).subscribe(response => {
      this.snackBar.open('Tag added successfully', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.fetchTags();
    }, error => {
      this.showError(error, 'Error adding tag')
    });
  }

  showError(msg: string, error?: any) {
    console.error('Error adding tag', error);
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar']
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
    });
  }
}
