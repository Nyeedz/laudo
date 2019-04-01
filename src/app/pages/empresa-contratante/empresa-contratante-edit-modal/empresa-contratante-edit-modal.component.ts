import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ViaCepService } from '../../../services/viaCep/via-cep.service';
import { EmpresaContratante } from '../../../models/empresaContratante';

@Component({
  selector: 'app-empresa-contratante-edit-modal',
  templateUrl: './empresa-contratante-edit-modal.component.html',
  styleUrls: ['./empresa-contratante-edit-modal.component.scss']
})
export class EmpresaContratanteEditModalComponent implements OnInit {
  cropFinished = false;
  form: FormGroup;
  imageBase64: any = null;
  croppedImage: any = '';
  croppedFile: any = null;

  constructor(
    public dialogRef: MatDialogRef<EmpresaContratanteEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaContratante,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
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
    console.log('confirmou');
    this.cropFinished = true;
  }

  changeImage() {
    this.cropFinished = false;
    this.imageBase64 = null;
    this.croppedImage = '';
  }

  fileOver(e) {
    console.log(e);
  }

  fileLeave(e) {
    console.log(e);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      cnpj: ['', Validators.required],
      nome_fantasia: ['', Validators.required],
      razao_social: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.compose([
            Validators.pattern(
              '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
            )
          ])
        ]
      ],
      telefone: ['', Validators.required],
      inscricao_estadual: ['', Validators.required],
      inscricao_municipal: ['', Validators.required],
      cep: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      contato_nome: [''],
      contato_telefone: [''],
      empresacredenciadas: [''],
      id: [''],
      logotipo: ['']
    });

    if (this.data.logotipo) {
      this.croppedImage = '//localhost:1337' + this.data.logotipo['url'];
      this.imageBase64 = '';
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
    cep.replace(/\D+/g, '');
    const validaCep = /^[0-9]{8}$/;
    if (cep != '' && validaCep.test(cep)) {
      this.resetaDadosForm(cep);
      this.viaCepService.getCep(cep).subscribe(
        result => {
          this.populaDadosCep(result);
        },
        error => {
          this.snackBar.open('❌ Cep não encontrado', 'OK', {
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
      numero: dados.numero
    });
  }

  resetaDadosForm(cep) {
    this.form.patchValue({
      cep: cep,
      bairro: null,
      cidade: null,
      estado: null,
      endereco: null,
      numero: null
    });
  }
}
