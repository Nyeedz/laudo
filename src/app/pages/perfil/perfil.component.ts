import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user/user.service";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { PerfilAvatarModalComponent } from "./perfil-avatar-modal/perfil-avatar-modal.component";

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.scss"]
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  empresaList: string[] = ["Empresas Credenciadas", "Empresas Contratantes"];
  credenciadaShow = false;
  contratanteShow = false;
  credenciada: any = [];
  contratante: any = [];
  avatar: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private viaCepService: ViaCepService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      nome: ["", Validators.required],
      email: [
        { value: "", disabled: true },
        [
          Validators.required,
          Validators.email,
          Validators.compose([
            Validators.pattern(
              "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
            )
          ])
        ]
      ],
      cep: ["", Validators.required],
      cidade: ["", Validators.required],
      bairro: ["", Validators.required],
      estado: ["", Validators.required],
      endereco: ["", Validators.required],
      numero: ["", Validators.required]
    });

    this.form.patchValue({
      username: this.currentUser.user.username,
      nome: this.currentUser.user.nome,
      email: this.currentUser.user.email,
      endereco: this.currentUser.user.endereco,
      numero: this.currentUser.user.numero,
      bairro: this.currentUser.user.bairro,
      cidade: this.currentUser.user.cidade,
      estado: this.currentUser.user.estado,
      cep: this.currentUser.user.cep
    });

    this.avatar = this.currentUser.user.foto!.url;
  }

  change(event) {
    if (event) {
      if (event.includes("credenciada")) {
        this.credenciadaShow = true;
        this.contratanteShow = false;
        this.userService
          .getById(this.currentUser.user._id)
          .subscribe(result => {
            this.credenciada = result["empresacres"];
            this.cdr.detectChanges();
            console.log(this.credenciada)
          });
      } else {
        this.credenciadaShow = false;
        this.contratanteShow = true;
        this.userService
          .getById(this.currentUser.user._id)
          .subscribe(result => {
            this.contratante = result["empresacons"];
            this.cdr.detectChanges();
          });
      }
    }
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

  avatarChange() {
    const dialogRef = this.dialog.open(PerfilAvatarModalComponent, {
      height: "400px",
      width: "400px",
      data: { avatar: this.avatar, user: this.currentUser.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
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
