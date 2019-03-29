import { Component, OnInit } from "@angular/core";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";
import { EmpresaContratanteService } from "src/app/services/empresa-contratante/empresa-contratante.service";

@Component({
  selector: "app-empresa-credenciada-create-modal",
  templateUrl: "./empresa-credenciada-create-modal.component.html",
  styleUrls: ["./empresa-credenciada-create-modal.component.scss"]
})
export class EmpresaCredenciadaCreateModalComponent implements OnInit {
  form: FormGroup;
  empresasList: any;

  constructor(
    public dialogRef: MatDialogRef<EmpresaCredenciadaCreateModalComponent>,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService,
    private empresaContatanteService: EmpresaContratanteService
  ) {}

  ngOnInit() {
    this.empresaContatanteService.getAll().subscribe(result => {
      this.empresasList = result;
    });

    this.form = this.formBuilder.group({
      cnpj: ["", Validators.required],
      nome_fantasia: ["", Validators.required],
      razao_social: ["", Validators.required],
      empresacredenciadas: ["", Validators.required],
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
      telefone: ["", Validators.required],
      inscricao_estadual: ["", Validators.required],
      inscricao_municipal: ["", Validators.required],
      cep: ["", Validators.required],
      bairro: ["", Validators.required],
      cidade: ["", Validators.required],
      estado: ["", Validators.required],
      endereco: ["", Validators.required],
      numero: ["", Validators.required],
      complemento: [""],
      contato_nome: [""],
      contato_telefone: [""],
      id: [""],
      logotipo: [""]
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
    this.dialogRef.close(dados);
  }
}
