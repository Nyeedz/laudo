import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { first } from "rxjs/operators";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { UserService } from "src/app/services/user/user.service";
import { MatSnackBar } from "@angular/material";

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
    private snackBar: MatSnackBar
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
          this.snackBar.open(
            "Não foi possivel se cadastrar, por favor tente mais tarde",
            "❌",
            {
              duration: 5000
            }
          );
          this.loading = false;
          setTimeout(() => {
            this.registerForm.reset();
          }, 1500);
        }
      );
  }
}
