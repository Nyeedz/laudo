import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ViaCepService } from 'src/app/services/viaCep/via-cep.service';
import { User } from '../../../models/user';
import { EmpresaContratanteService } from '../../../services/empresa-contratante/empresa-contratante.service';
import { EmpresaCredenciadaService } from '../../../services/empresa-credenciada/empresa-credenciada.service';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss']
})
export class UserEditModalComponent implements OnInit {
  cropFinished = false;
  form: FormGroup;
  imageBase64: any = null;
  croppedImage: any = '';
  croppedFile: any = null;
  credenciadasList: any;
  contratantesList: any;
  hide = false;

  constructor(
    public dialogRef: MatDialogRef<UserEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private contratanteService: EmpresaContratanteService,
    private credenciadaService: EmpresaCredenciadaService
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
    this.credenciadaService.getAll().subscribe(result => {
      this.credenciadasList = result;
    });

    this.contratanteService.getAll().subscribe(result => {
      this.contratantesList = result;
    });


    this.form = this.formBuilder.group({
      nome: [''],
      endereco: [''],
      _id: [''],
      numero: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      cep: [''],
      username: [''],
      telefone: [''],
      password: ["", [, Validators.minLength(6)]],
      confirmPassword: ["", ],
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

    if (this.data.foto) {
      this.croppedImage = '//191.252.59.5:7100' + this.data.foto['url'];
      this.imageBase64 = '';
      this.cropFinished = true;
      this.cdr.detectChanges();
    }

    this.form.patchValue({
      ...this.data,
      empresacons: this.data.empresacons.map(empresa => empresa._id),
      empresacres: this.data.empresacres.map(empresa => empresa._id),
    });

  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const formData = this.form.getRawValue();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      delete formData.password
    }

    if (!formData.confirmPassword || formData.confirmPassword.length < 6) {
      delete formData.confirmPassword
    }

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
