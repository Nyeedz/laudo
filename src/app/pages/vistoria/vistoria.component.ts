import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ViaCepService } from 'src/app/services/viaCep/via-cep.service';
import { MatSnackBar, MatDatepickerInputEvent } from '@angular/material';
import { VistoriaService } from 'src/app/services/vistoria/vistoria.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { SolicitacoesService } from 'src/app/services/solicitacoes/solicitacoes.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
declare var ol: any;

@Component({
  selector: 'app-vistoria',
  templateUrl: './vistoria.component.html',
  styleUrls: ['./vistoria.component.scss']
})
export class VistoriaComponent implements OnInit {
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#fff',
      buttonColor: '#d3a03d'
    },
    dial: {
      dialBackgroundColor: '#d3a03d'
    },
    clockFace: {
      clockFaceBackgroundColor: '#d3a03d',
      clockHandColor: '#e7c882',
      clockFaceTimeInactiveColor: '#fff'
    }
  };
  form: FormGroup;
  partes: FormArray;
  showMap = false;
  tipos_laudo = [
    { value: 'Vistoria locativa de entrada' },
    { value: 'Vistoria locativa de saida' },
    { value: 'Vistoria cautelar de vizinhança' },
    { value: 'Parecer técnico' },
    { value: 'Laudo judicial' },
    { value: 'Laudo de constatação' }
  ];
  date: Date;
  users: any;
  map: any;

  constructor(
    private formBuilder: FormBuilder,
    private viaCepService: ViaCepService,
    private snackBar: MatSnackBar,
    private vistoriaService: VistoriaService,
    private router: Router,
    private solicitacoesService: SolicitacoesService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.get().subscribe(result => {
      this.users = result;
    });
    this.form = this.formBuilder.group({
      cep: ['', Validators.required],
      cidade: ['', Validators.required],
      bairro: ['', Validators.required],
      estado: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      partes: this.formBuilder.array([]),
      tipos_laudo: ['', Validators.required],
      data: ['', Validators.required],
      hora: ['', Validators.required],
      user: ['', Validators.required]
    });

    this.addParte();
    this.startMap();
  }

  startMap() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([73.8567, 18.5204]),
        zoom: 8
      })
    });
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }

  createParte(): FormGroup {
    return this.formBuilder.group({
      titulo: ['', Validators.required],
      nome_parte: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.compose([
            Validators.pattern(
              '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
            )
          ])
        ]
      ],

      telefone: ['', Validators.required]
    });
  }

  addParte(): void {
    this.partes = this.form.get('partes') as FormArray;
    this.partes.push(this.createParte());
  }

  deleteParte(index) {
    this.partes.removeAt(index);
  }

  consultaCep(cep) {
    cep.replace(/\D+/g, '');
    const validaCep = /^[0-9]{8}$/;
    if (cep != '' && validaCep.test(cep)) {
      this.resetaDadosForm(cep);
      this.viaCepService.getCep(cep).subscribe(
        result => {
          this.populaDadosCep(result);
        },
        () => {
          this.snackBar.open('❌ Cep não encontrado', 'OK', {
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

  create() {
    if (this.form.invalid) {
      return;
    }
    const moment_date = moment(this.form.controls.data.value).format(
      'DD/MM/YYYY'
    );
    const hour = this.form.controls.hora.value;
    const moment_hour = moment(hour, 'hh:mm a').format('HH:mm');
    const pronto = moment(`${moment_date} ${moment_hour}`, 'DD/MM/YYYY HH:mm');

    const dados = {
      ...this.form.getRawValue(),
      visita: pronto
    };

    this.vistoriaService.create(dados).subscribe(
      res => {
        this.solicitacoesService
          .create({ vistoria: res['_id'], status: [{ value: 'Em aberto' }] })
          .subscribe(() => {
            this.snackBar.open(`✔️ Vistoria Solicitada com sucesso!`, 'Ok', {
              duration: 3000
            });
            this.router.navigate(['/dashboard/solicitacoes']);
          });
      },
      () => {
        this.snackBar.open('❌ Erro ao solicitar a vistoria', 'Ok', {
          duration: 3000
        });
      }
    );
  }
}
