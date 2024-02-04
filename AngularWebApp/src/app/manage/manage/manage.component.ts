import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Tag } from 'src/app/document/Tag';
import { DocumentService } from 'src/app/document/document.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  tags: Tag[] = [];
  selectedTags: Tag[] = [];
  notSelectedTags: Tag[] = [];
  newTagString: string = "";

  constructor(private documentService: DocumentService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.documentService.getTags().subscribe((tags) => {
      this.tags = tags;
      this.notSelectedTags = tags;
    })
  }

  OnBtnUploadClicked(event: Event) {
    if (!event)
      return;

    const target = event.target as HTMLInputElement;

    if (!target.files)
      return;

    const file = target.files[0];

    const formData = new FormData();
    formData.append('file', file, file.name);

    this.documentService.post(formData).subscribe(guid => {
      this.documentService.postDocumentTags(this.selectedTags, guid).subscribe(() => {
        this.showToastSuccess("Erfolgreich hochgeladen", "Die Datei " + file.name + " wurde hochgeladen");
      })
    });
  }

  showToastSuccess(summary: string, detail: string) {
    this.messageService.add({ severity: 'success', summary: summary, detail: detail });
  }

  onAddTag() {
    let tag: Tag = {
      guid: '',
      name: this.newTagString
    };

    this.tags.push(tag);

    this.documentService.postTag(tag).subscribe((guid) => {
      tag.guid = guid;
      this.showToastSuccess("Tag hochgeladen", "Der Tag " + tag.name + " wurde erfolgreich hochgeladen")
    })

    this.newTagString = "";
  }

  onRemoveTag(tag: Tag) {
    this.tags = this.tags.filter(item => {
      return item != tag;
    })
  }

  onRemoveSelectedTag(tag: Tag) {
    this.removeNotSelectedTag(tag);
    this.notSelectedTags.push(tag);
  }

  onRemoveNotSelectedTag(tag: Tag) {
    this.removeNotSelectedTag(tag)
  }

  onAddTagToDocument(tag: Tag) {
    this.selectedTags.push(tag);
    this.removeNotSelectedTag(tag)
  }

  removeNotSelectedTag(tag: Tag) {
    this.notSelectedTags = this.notSelectedTags.filter(item => {
      return item != tag;
    })
  }

  removeSelectedTag(tag: Tag){
    this.selectedTags = this.selectedTags.filter(item => {
      return item != tag;
    })
  }

}
