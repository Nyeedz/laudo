import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from "@angular/material";
import { EmpresaCredenciada } from "src/app/models/empresaCredenciada";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";
import { FileSystemFileEntry } from "ngx-file-drop";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { EmpresaContratanteService } from "src/app/services/empresa-contratante/empresa-contratante.service";

@Component({
  selector: "app-empresa-credenciada-edit-modal",
  templateUrl: "./empresa-credenciada-edit-modal.component.html",
  styleUrls: ["./empresa-credenciada-edit-modal.component.scss"]
})
export class EmpresaCredenciadaEditModalComponent implements OnInit {
  cropFinished = false;
  form: FormGroup;
  imageBase64: any = null;
  croppedImage: any = "";
  croppedFile: any = null;
  empresasList: any = null;

  constructor(
    public dialogRef: MatDialogRef<EmpresaCredenciadaEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaCredenciada,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private cdr: ChangeDetectorRef,
    private empresaContratanteService: EmpresaContratanteService
  ) {}

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
    console.log("confirmou");
    this.cropFinished = true;
  }

  changeImage() {
    this.cropFinished = false;
    this.imageBase64 = null;
    this.croppedImage = "";
  }

  fileOver(e) {
    console.log(e);
  }

  fileLeave(e) {
    console.log(e);
  }

  ngOnInit() {
    this.empresaContratanteService.getAll().subscribe(result => {
      if (result) this.empresasList = result;
    });

    this.form = this.formBuilder.group({
      cnpj: [""],
      nome_fantasia: ["", Validators.required],
      razao_social: [""],
      empresacons: [""],
      email: ["", [Validators.required, Validators.email]],
      telefone: [""],
      inscricao_estadual: [""],
      inscricao_municipal: [""],
      cep: [""],
      bairro: [""],
      cidade: [""],
      estado: [""],
      endereco: [""],
      numero: [""],
      complemento: [""],
      contato_nome: [""],
      contato_telefone: [""],
      id: [""],
      logotipo: [""]
    });

    if (this.data.logotipo) {
      this.croppedImage = "//localhost:1337" + this.data.logotipo["url"];
      this.imageBase64 = "";
      this.cropFinished = true;
      this.cdr.detectChanges();
    }

    this.form.patchValue(this.data);
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const formData = this.form.getRawValue();
    this.dialogRef.close({ dados: formData, file: this.croppedFile });
  }

  consultaCep(cep) {
    cep.replace(/\D+/g, "");
    const validaCep = /^[0-9]{8}$/;
    if (cep != "" && validaCep.test(cep)) {
      this.resetaDadosForm(cep);
      this.viaCepService.getCep(cep).subscribe(
        result => {
          this.populaDadosCep(result);
        },
        error => {
          this.snackBar.open("❌ Cep não encontrado", "OK", {
            duration: 2000
          });
        }
      );
    }
  }

  populaDadosCep(dados) {
    this.form.patchValue({
      cep: dados.cep,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
      endereco: dados.logradouro,
      numero: dados.numero,
      complemento: dados.complemento
    });
  }

  resetaDadosForm(cep) {
    this.form.patchValue({
      cep: cep,
      bairro: null,
      cidade: null,
      estado: null,
      endereco: null,
      numero: null,
      complemento: null
    });
  }
}
