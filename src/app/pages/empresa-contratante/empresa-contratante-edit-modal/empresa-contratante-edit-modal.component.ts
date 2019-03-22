import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmpresaContratante } from '../../../models/empresaContratante';

@Component({
  selector: 'app-empresa-contratante-edit-modal',
  templateUrl: './empresa-contratante-edit-modal.component.html',
  styleUrls: ['./empresa-contratante-edit-modal.component.scss']
})
export class EmpresaContratanteEditModalComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EmpresaContratanteEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaContratante,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      bairro: [''],
      cep: [''],
      cidade: [''],
      cnpj: [''],
      complemento: [''],
      contato_nome: [''],
      contato_telefone: [''],
      email: [''],
      empresacredenciadas: [''],
      endereco: [''],
      estado: [''],
      id: [''],
      inscricao_estadual: [''],
      inscricao_municipal: [''],
      logotipo: [''],
      nome_fantasia: [''],
      numero: [''],
      razao_social: [''],
      telefone: ['']
    });
  }

  ngOnInit() {
    this.form.patchValue(this.data);
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const formData = this.form.getRawValue();
    this.dialogRef.close(formData);
  }
}
