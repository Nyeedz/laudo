import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViaCepService } from 'src/app/services/viaCep/via-cep.service';
import { MatSnackBar, MatDialogRef, MatPaginator } from '@angular/material';
import { EmpresaCredenciadaService } from 'src/app/services/empresa-credenciada/empresa-credenciada.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { UserService } from 'src/app/services/user/user.service';
import { EmpresaContratanteService } from 'src/app/services/empresa-contratante/empresa-contratante.service';

@Component({
  selector: 'app-user-modal-create',
  templateUrl: './user-modal-create.component.html',
  styleUrls: ['./user-modal-create.component.scss']
})
export class UserModalCreateComponent implements OnInit {
  cropFinished = false;
  form: FormGroup;
  imageBase64: any = null;
  croppedImage: any = '';
  credenciadasList: any;
  contratantesList: any;
  croppedFile: any = null;
  hide = false;

  constructor(
    public dialogRef: MatDialogRef<UserModalCreateComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private userService: UserService,
    private contratanteService: EmpresaContratanteService,
    private credenciadaService: EmpresaCredenciadaService,
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
    console.log('confirmou');
    this.cropFinished = true;
  }

  changeImage() {
    this.cropFinished = false;
    this.imageBase64 = null;
    this.croppedImage = '';
  }

  ngOnInit() {
    this.credenciadaService.getAll().subscribe(result => {
      this.credenciadasList = result;
    });

    this.contratanteService.getAll().subscribe(result => {
      this.contratantesList = result;
    });

    this.form = this.formBuilder.group({
      nome: [''],
      endereco: [''],
      numero: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      cep: [''],
      username: [''],
      telefone: [''],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
      email: [
        '',
        [
          Validators.email,
          Validators.compose([
            Validators.pattern(
              '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
            )
          ])
        ]
      ],
      empresacres: [[]],
      empresacons: [[]]
    });
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
      numero: dados.numero,
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
    });
  }

  create() {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) {
      return;
    }

    const dados = this.form.getRawValue();
    this.dialogRef.close({ dados, file: this.croppedFile });
  }
}
