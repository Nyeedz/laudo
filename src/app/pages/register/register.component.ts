import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { UserService } from "src/app/services/user/user.service";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  firstForm: FormGroup;
  secondForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService
  ) {}

  ngOnInit() {
    this.firstForm = this.formBuilder.group({
      username: ["", Validators.required],
      email: [
        "",
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
      nome: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required]
    });

    this.secondForm = this.formBuilder.group({
      cep: ["", Validators.required],
      cidade: ["", Validators.required],
      bairro: ["", Validators.required],
      estado: ["", Validators.required],
      endereco: ["", Validators.required],
      numero: ["", Validators.required]
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
    this.secondForm.patchValue({
      cep: dados.cep,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
      endereco: dados.logradouro,
      numero: dados.numero
    });
  }

  resetaDadosForm(cep) {
    this.secondForm.patchValue({
      cep: cep,
      bairro: null,
      cidade: null,
      estado: null,
      endereco: null,
      numero: null
    });
  }

  onSubmit() {
    if (this.firstForm.invalid || this.secondForm.invalid) {
      return;
    }

    this.loading = true;
    const dados = {
      ...this.firstForm.getRawValue(),
      ...this.secondForm.getRawValue()
    };

    this.userService
      .register(dados)
      .pipe(first())
      .subscribe(
        data => {
          this.snackBar.open(
            `Usuário ${data.user.username} cadastrado com sucesso!`,
            "✔️",
            {
              duration: 5000
            }
          );
          this.router.navigate(["/"]);
        },
        error => {
          this.snackBar.open(`❌ ${error.error.message}`, "Ok", {
            duration: 5000
          });
          this.loading = false;
        }
      );
  }
}
