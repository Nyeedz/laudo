import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from 'src/app/services/upload/upload.service';
import { ItensService } from 'src/app/services/itens/itens.service';

@Component({
  selector: 'itens.component',
  templateUrl: 'itens.component.html',
  styleUrls: ['./itens.component.scss']
})
export class ItensComponent implements OnInit {
  itemForm: FormGroup;
  breakpoint = 2;
  fixedHeader = true;
  picturesToRemove: any[] = [];
  picturesToUpload: any[] = [];
  pictures = [];

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadService,
    private itensService: ItensService,
    public dialogRef: MatDialogRef<ItensComponent>,
    @Inject(MAT_DIALOG_DATA) public item: any
  ) {}

  ngOnInit() {
    this.itemForm = this.formBuilder.group({
      nome: ['', Validators.required]
    });

    this.itemForm.patchValue(this.item);
    this.pictures = [...this.item.fotos];
    this.breakpoint = window.innerWidth <= 700 ? 1 : 2;
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth <= 700 ? 1 : 2;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  async submit() {
    try {
      if (this.itemForm.invalid) {
        return;
      }

      const newItem = await this.itensService.update(
        { ...this.itemForm.getRawValue() },
        this.item._id
      );

      await Promise.all(this.picturesToRemove.map(picture => {
        return this.uploadService.deleteFile(picture._id)
      }))

      await Promise.all(this.picturesToUpload.map(picture => {
        const formData = new FormData();
        formData.append('ref', 'itens');
        formData.append('refId', this.item._id);
        formData.append('field', 'fotos');
        formData.append('files', picture.file);

        return this.uploadService.send(formData).toPromise();
      }))

      this.dialogRef.close(true);
    } catch (err) {
      console.log(err);
    }
  }

  async imageChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();

      reader.onload = e => {
        const object = {
          uri: e.target['result'],
          file: event.target.files[0]
        };

        this.picturesToUpload.push(object);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeFoto(foto, index?: number) {
    if (index !== undefined) {
      const fotos = this.picturesToUpload.filter((value, i) => {
        return i !== index;
      });

      this.picturesToUpload = fotos;
    } else {
      const fotos = this.pictures.filter(value => {
        return foto._id != value._id;
      });

      this.picturesToRemove.push(foto);
      this.pictures = fotos;
    }
  }
}
