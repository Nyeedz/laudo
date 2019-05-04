import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-vistoria",
  templateUrl: "./vistoria.component.html",
  styleUrls: ["./vistoria.component.scss"]
})
export class VistoriaComponent implements OnInit {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private viaCepService: ViaCepService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      nome: ["", Validators.required],
      cep: ["", Validators.required],
      cidade: ["", Validators.required],
      bairro: ["", Validators.required],
      estado: ["", Validators.required],
      endereco: ["", Validators.required],
      numero: ["", Validators.required],
      complemento: [''],
      credentials: this.formBuilder.array([])
    });
  }

  add() {
    const creds = this.form.controls.credentials as FormArray;
    creds.push(
      this.formBuilder.group({
        titulo: "",
        nome_parte: "",
        email: "",
        telefone: ""
      })
    );
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
    this.form.patchValue({
      cep: dados.cep,
      bairro: dados.bairro,
      cidade: dados.localidade,
      estado: dados.uf,
      endereco: dados.logradouro,
      numero: dados.numero,
      complemento: dados.complemento
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
      complemento: null
    });
  }
}
