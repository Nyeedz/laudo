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
  selected = 'credenciada';

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
      cep: this.currentUser.user.cep,
      endereco: this.currentUser.user.endereco,
      bairro: this.currentUser.user.bairro,
      cidade: this.currentUser.user.cidade,
      estado: this.currentUser.user.estado,
      numero: this.currentUser.user.numero
    });

    this.avatar = this.currentUser.user.foto
      ? this.currentUser.user.foto.url
      : null;
  }

  change(event) {
    if (event) {
      if (event.includes("credenciada")) {
        this.credenciadaShow = true;
        this.contratanteShow = false;
        this.userService.getMe().subscribe(result => {
          console.log('teste')
          this.credenciada = result["empresacres"];
          this.cdr.detectChanges();
        });
      } else {
        this.credenciadaShow = false;
        this.contratanteShow = true;
        this.userService.getMe().subscribe(result => {
          console.log('teste')
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
      if (result) {
        setTimeout(() => {
          this.avatar = "/uploads/" + result[0].hash;
        }, 500);
        const user = this.currentUser.user;
        user.foto = { ...result[0], url: `/uploads/${result[0].hash}` };
        localStorage.setItem(
          "currentUser",
          JSON.stringify({ ...this.currentUser, user })
        );
      }
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

  save() {
    const dadosForm = this.form.getRawValue();
    return this.userService
      .update(dadosForm, this.currentUser.user._id)
      .subscribe(
        result => {
          if (result) {
            this.snackBar.open(`✔️ Seus dados foram salvo com sucesso!`, "Ok", {
              duration: 5000
            });

            localStorage.setItem(
              "currentUser",
              JSON.stringify({
                ...this.currentUser,
                user: result
              })
            );

            this.form.patchValue(result);
          }
        },
        error => {
          this.snackBar.open(`❌ Erro ao editar suas informações`, "Ok", {
            duration: 5000
          });
        }
      );
  }
}
