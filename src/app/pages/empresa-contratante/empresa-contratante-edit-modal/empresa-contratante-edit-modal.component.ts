import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { FileSystemFileEntry } from "ngx-file-drop";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { ViaCepService } from "../../../services/viaCep/via-cep.service";
import { EmpresaContratante } from "../../../models/empresaContratante";
import { EmpresaCredenciadaService } from "src/app/services/empresa-credenciada/empresa-credenciada.service";

@Component({
  selector: "app-empresa-contratante-edit-modal",
  templateUrl: "./empresa-contratante-edit-modal.component.html",
  styleUrls: ["./empresa-contratante-edit-modal.component.scss"]
})
export class EmpresaContratanteEditModalComponent implements OnInit {
  cropFinished = false;
  form: FormGroup;
  imageBase64: any = null;
  croppedImage: any = "";
  croppedFile: any = null;
  empresasList: any;

  constructor(
    public dialogRef: MatDialogRef<EmpresaContratanteEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaContratante,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private cdr: ChangeDetectorRef,
    private empresaCredenciadaService: EmpresaCredenciadaService
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
    this.empresaCredenciadaService.getAll().subscribe(result => {
      this.empresasList = result;
    });
    this.form = this.formBuilder.group({
      cnpj: [""],
      nome_fantasia: ["", Validators.required],
      razao_social: [""],
      email: ['', [Validators.required, Validators.email]],
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
      empresacredenciadas: [""],
      id: [""],
      logotipo: [""]
    });

    if (this.data.logotipo) {
      this.croppedImage = "//191.252.59.5:7100" + this.data.logotipo["url"];
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
