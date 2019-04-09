import { ChangeDetectorRef, Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FileSystemFileEntry } from "ngx-file-drop";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { UploadService } from "../../../services/upload/upload.service";

@Component({
  selector: "app-perfil-avatar-modal",
  templateUrl: "./perfil-avatar-modal.component.html",
  styleUrls: ["./perfil-avatar-modal.component.scss"]
})
export class PerfilAvatarModalComponent {
  cropFinished = false;
  imageBase64: any = null;
  croppedImage: any = "";
  empresasList: any;
  croppedFile: any = null;

  constructor(
    public dialogRef: MatDialogRef<PerfilAvatarModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef,
    private upload: UploadService
  ) {
    if (this.data.user.foto) {
      this.croppedImage = "//localhost:1337" + this.data.user.foto["url"];
      this.imageBase64 = "";
      this.cropFinished = true;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedFile = event.file;
  }

  imageLoaded() {
    // show cropper
  }

  loadImageFailed() {
    // show message
  }

  dropped(e) {
    console.log(e);
    const droppedFile = e.files[0];
    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
    const reader = new FileReader();

    fileEntry.file(file => {
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageBase64 = reader.result;
        this.cdr.detectChanges();
      };
    });
  }

  confirmImage() {
    this.cropFinished = true;
  }

  changeImage() {
    this.cropFinished = false;
    this.imageBase64 = null;
    this.croppedImage = "";
  }

  fileOver(e) {}

  fileLeave(e) {}

  save() {
    if (this.croppedFile) {
      console.log(this.data.user);
      const arquivo = new FormData();
      arquivo.append("ref", "user");
      arquivo.append("refId", this.data.user._id);
      arquivo.append("field", "foto");
      arquivo.append("files", this.croppedFile);
      arquivo.append("path", "/user/avatar");
      arquivo.append("source", "users-permissions");

      this.upload.send(arquivo).subscribe(res => {
        this.dialogRef.close(res);
      });
    } else {
      this.dialogRef.close();
    }
  }
}
