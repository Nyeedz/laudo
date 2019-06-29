import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { Solicitacoes } from "src/app/models/solicitacoes";
import { ViaCepService } from "src/app/services/viaCep/via-cep.service";

@Component({
  selector: "app-solicitacoes-edit-modal",
  templateUrl: "./solicitacoes-edit-modal.component.html",
  styleUrls: ["./solicitacoes-edit-modal.component.scss"]
})
export class SolicitacoesEditModalComponent implements OnInit {
  form: FormGroup;
  form2: FormGroup;
  ambientes: boolean = false;
  vistorias: boolean = false;
  isLinear: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SolicitacoesEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Solicitacoes,
    private viaCepService: ViaCepService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: [""]
    });

    this.form2 = this.fb.group({
      cep: [""],
      cidade: [""],
      bairro: [""],
      estado: [""],
      endereco: [""],
      numero: [""],
      // tipos_laudo: [""],
      // data: [""],
      // hora: [""],
      user: [""]
    });

    console.log(this.data);

    this.form2.patchValue(this.data);
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
    this.form2.patchValue({
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
