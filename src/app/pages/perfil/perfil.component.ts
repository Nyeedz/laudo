import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.component.html",
  styleUrls: ["./perfil.component.scss"]
})
export class PerfilComponent implements OnInit {
  form: FormGroup;
  currentUser = JSON.parse(localStorage.getItem("currentUser"));
  empresaList: string[] = ["Empresas Credenciadas", "Empresas Contratantes"];
  credenciadaShow: boolean = false;
  contratanteShow: boolean = false;
  credenciada: any;
  contratante: any;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
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
      endereco: ["", Validators.required],
      numero: ["", Validators.required],
      bairro: ["", Validators.required],
      cidade: ["", Validators.required],
      estado: ["", Validators.required],
      empresas: [""]
    });

    this.form.patchValue({
      username: this.currentUser.user.username,
      nome: this.currentUser.user.nome,
      email: this.currentUser.user.email,
      endereco: this.currentUser.user.endereco,
      numero: this.currentUser.user.numero,
      bairro: this.currentUser.user.bairro,
      cidade: this.currentUser.user.cidade,
      estado: this.currentUser.user.estado
    });
  }

  change(event) {
    if (event) {
      if (event.includes("credenciada")) {
        this.credenciadaShow = true;
        this.credenciadaShow = false;
        this.userService.getById(this.currentUser.user.id).subscribe(result => {
          this.credenciada = result.empresacredenciada;
        });
      } else {
        this.credenciadaShow = false
        this.contratanteShow = true
        this.userService.getById(this.currentUser.user.id).subscribe(result => {
          result.empresacontratantes.map(value => {
            this.contratante = value
          })
        });
      }
    }
  }
}
