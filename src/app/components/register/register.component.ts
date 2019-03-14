import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { UserService } from "src/app/services/user/user.service";
import { MatSnackBar } from "@angular/material";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(["/"]);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      nome: ["", Validators.required],
      cep: ["", Validators.required],
      cidade: ["", Validators.required],
      bairro: ["", Validators.required],
      estado: ["", Validators.required],
      endereco: ["", Validators.required],
      numero: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmedPassword: ["", Validators.required]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  login() {
    this.router.navigate(["/"]);
  }

  consultaCep(cep) {
    cep.replace(/\D+/g, "");
    if (cep != "") {
      let validaCep = /^[0-9]{8}$/;

      if (validaCep.test(cep)) {
        this.resetaDadosForm(this.registerForm);
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
  }

  populaDadosCep(dados) {
    this.registerForm.patchValue({
      cep: dados.cep,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
      endereco: dados.logradouro
    });
  }

  resetaDadosForm(form) {
    this.registerForm.patchValue({
      cep: form.cep,
      bairro: null,
      cidade: null,
      estado: null,
      endereco: null
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    this.loading = true;
    this.userService
      .register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.snackBar.open("Usuário cadastrado com sucesso!", "✔️", {
            duration: 5000
          });
          this.router.navigate(["/login"]);
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
