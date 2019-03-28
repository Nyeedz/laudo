import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { EmpresaContratante } from "../../../models/empresaContratante";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";

@Component({
  selector: "app-empresa-contratante-edit-modal",
  templateUrl: "./empresa-contratante-edit-modal.component.html",
  styleUrls: ["./empresa-contratante-edit-modal.component.scss"]
})
export class EmpresaContratanteEditModalComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EmpresaContratanteEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaContratante,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private viaCepService: ViaCepService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      cnpj: ["", Validators.required],
      nome_fantasia: ["", Validators.required],
      razao_social: ["", Validators.required],
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
      empresacredenciadas: [""],
      id: [""],
      logotipo: [""]
    });
    this.form.patchValue(this.data);
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const formData = this.form.getRawValue();
    this.dialogRef.close(formData);
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
}
