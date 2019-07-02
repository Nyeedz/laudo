import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  partesForm: FormGroup;
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

    this.partesForm = this.fb.group({
      partes: this.fb.array([this.createParte()])
    });

    console.log(this.data["partes"]);
    console.log(this.partesForm.get("partes"));

    this.partesForm.patchValue(this.data["partes"]);
    this.form2.patchValue(this.data);
  }

  createParte(): FormGroup {
    return this.fb.group({
      titulo: ["", Validators.required],
      nome_parte: ["", Validators.required],
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

  save() {
    if (this.form2.invalid) return;

    const formData2 = this.form2.getRawValue();
    this.dialogRef.close({ dados: formData2, vistoriaId: this.data.id });
  }
}
