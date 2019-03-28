import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";
import { MatSnackBar } from "@angular/material";
import { EmpresaContratanteService } from "src/app/services/empresa-contratante/empresa-contratante.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-empresa-contratante-create-modal",
  templateUrl: "./empresa-contratante-create-modal.component.html",
  styleUrls: ["./empresa-contratante-create-modal.component.scss"]
})
export class EmpresaContratanteCreateModalComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private empresaContratanteService: EmpresaContratanteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      cep: ["", Validators.required],
      cidade: ["", Validators.required],
      bairro: ["", Validators.required],
      estado: ["", Validators.required],
      endereco: ["", Validators.required],
      numero: ["", Validators.required],
      cnpj: ["", Validators.required],
      complemento: ["", Validators.required],
      contato_nome: ["", Validators.required],
      contato_telefone: ["", Validators.required],
      email: ["", Validators.required],
      empresacredenciadas: ["", Validators.required],
      id: ["", Validators.required],
      inscricao_estadual: ["", Validators.required],
      inscricao_municipal: ["", Validators.required],
      logotipo: ["", Validators.required],
      nome_fantasia: ["", Validators.required],
      razao_social: ["", Validators.required],
      telefone: ["", Validators.required]
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

  create() {
    if (this.form.invalid) {
      return;
    }

    const dados = this.form.getRawValue();
    this.loading = true;

    this.empresaContratanteService.create(dados).subscribe(
      result => {
        console.log(result);
        this.router.navigate(["/dashboard/empresas-contratantes"]);
        this.loading = false;
      },
      error => {
        this.snackBar.open("❌ Erro ao cadastrar a empresa contratante", "Ok", {
          duration: 5000
        });
        this.loading = false;
      }
    );
  }
}
