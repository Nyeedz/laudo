import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const user = this.loginForm.getRawValue();
    this.loading = true;

    this.authenticationService
      .login(user)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(["/dashboard"]);
        },
        error => {
          this.snackBar.open("❌ Usuário ou Senha inválido", "Ok", {
            duration: 5000
          });
        }
      )
      .add(() => {
        this.loading = false;
      });
  }

  register() {
    this.router.navigate(['/register']);
  }
}
