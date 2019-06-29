import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Solicitacoes } from "src/app/models/solicitacoes";

@Component({
  selector: "app-solicitacoes-edit-modal",
  templateUrl: "./solicitacoes-edit-modal.component.html",
  styleUrls: ["./solicitacoes-edit-modal.component.scss"]
})
export class SolicitacoesEditModalComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SolicitacoesEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Solicitacoes
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cep: [""],
      cidade: [""],
      bairro: [""],
      estado: [""],
      endereco: [""],
      numero: [""],
      complemento: [""],
      partes: this.fb.array([]),
      tipos_laudo: [""],
      data: [""],
      hora: [""],
      user: [""]
    });
  }
}
