import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";
import { EmpresaContratanteService } from "src/app/services/empresa-contratante/empresa-contratante.service";
import { FileSystemFileEntry } from "ngx-file-drop";
import { ImageCroppedEvent } from "ngx-image-cropper";

@Component({
  selector: "app-empresa-credenciada-create-modal",
  templateUrl: "./empresa-credenciada-create-modal.component.html",
  styleUrls: ["./empresa-credenciada-create-modal.component.scss"]
})
export class EmpresaCredenciadaCreateModalComponent implements OnInit {
  cropFinished = false;
  form: FormGroup;
  imageBase64: any = null;
  croppedImage: any = "";
  empresasList: any;
  croppedFile: any = null;

  constructor(
    public dialogRef: MatDialogRef<EmpresaCredenciadaCreateModalComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private empresaContatanteService: EmpresaContratanteService,
    private cdr: ChangeDetectorRef
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

  fileOver(e) {
    console.log(e);
  }

  fileLeave(e) {
    console.log(e);
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

  ngOnInit() {
    this.empresaContatanteService.getAll().subscribe(result => {
      this.empresasList = result;
    });

    this.form = this.formBuilder.group({
      cnpj: [],
      nome_fantasia: ["", Validators.required],
      razao_social: [],
      empresacons: [],
      email: ["", [Validators.required, Validators.email]],
      telefone: [],
      inscricao_estadual: [],
      inscricao_municipal: [],
      cep: [],
      bairro: [],
      cidade: [],
      estado: [],
      endereco: [],
      numero: [],
      complemento: [],
      contato_nome: [],
      contato_telefone: [],
      id: [],
      logotipo: []
    });
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

  create() {
    if (this.form.invalid) {
      return;
    }

    let dados = {};

    if (
      this.form.controls.empresacons.value === null ||
      this.form.controls.empresacons.value === "" ||
      this.form.controls.email.value === null ||
      this.form.controls.email.value === ""
    ) {
      dados = {
        bairro: this.form.controls.bairro.value,
        cep: this.form.controls.cep.value,
        cidade: this.form.controls.cidade.value,
        cnpj: this.form.controls.cnpj.value,
        complemento: this.form.controls.complemento.value,
        contato_nome: this.form.controls.contato_nome.value,
        contato_telefone: this.form.controls.contato_telefone.value,
        endereco: this.form.controls.endereco.value,
        estado: this.form.controls.estado.value,
        id: this.form.controls.id.value,
        inscricao_estadual: this.form.controls.inscricao_estadual.value,
        inscricao_municipal: this.form.controls.inscricao_municipal.value,
        logotipo: this.form.controls.logotipo.value,
        nome_fantasia: "teste",
        numero: this.form.controls.numero.value,
        razao_social: this.form.controls.razao_social.value,
        telefone: this.form.controls.telefone.value
      };
    } else {
      dados = this.form.getRawValue();
    }
    this.dialogRef.close({ dados, file: this.croppedFile });
  }
}
