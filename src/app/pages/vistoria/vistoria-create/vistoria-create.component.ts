import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar, MatStepper } from "@angular/material";
import { Router } from "@angular/router";
import * as moment from "moment";
import { NgxMaterialTimepickerTheme } from "ngx-material-timepicker";
import { LaudoService } from "../../../services/laudo/laudo.service";
import { UserService } from "../../../services/user/user.service";
import { ViaCepService } from "../../../services/viaCep/via-cep.service";
import { VistoriaService } from "../../../services/vistoria/vistoria.service";
declare var ol;

@Component({
  selector: "app-vistoria-create",
  templateUrl: "./vistoria-create.component.html",
  styleUrls: ["./vistoria-create.component.scss"]
})
export class VistoriaCreateComponent implements OnInit {
  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: "#fff",
      buttonColor: "#d3a03d"
    },
    dial: {
      dialBackgroundColor: "#d3a03d"
    },
    clockFace: {
      clockFaceBackgroundColor: "#d3a03d",
      clockHandColor: "#e7c882",
      clockFaceTimeInactiveColor: "#fff"
    }
  };
  generalForm: FormGroup;
  locationForm: FormGroup;
  partesForm: FormGroup;
  partes: FormArray;
  showMap = false;
  tipos_laudo = [
    { value: "Vistoria locativa de entrada" },
    { value: "Vistoria locativa de saida" },
    { value: "Vistoria cautelar de vizinhança" },
    { value: "Parecer técnico" },
    { value: "Laudo judicial" },
    { value: "Laudo de constatação" }
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
    private laudoService: LaudoService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.get().subscribe(result => {
      this.users = result;
    });

    this.generalForm = this.formBuilder.group({
      tipos_laudo: ["", Validators.required],
      data: ["", Validators.required],
      hora: ["", Validators.required],
      user: ["", Validators.required]
    });

    this.locationForm = this.formBuilder.group({
      cep: ["", Validators.required],
      cidade: ["", Validators.required],
      bairro: ["", Validators.required],
      estado: ["", Validators.required],
      endereco: ["", Validators.required],
      numero: ["", Validators.required],
      complemento: [""]
    });

    this.partesForm = this.formBuilder.group({
      partes: this.formBuilder.array([])
    });

    // this.addParte();
  }

  startMap() {
    this.map = new ol.Map({
      target: "map",
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

  addParte(): void {
    this.partes = this.partesForm.get("partes") as FormArray;
    this.partes.push(this.createParte());
  }

  deleteParte(index) {
    this.partes.removeAt(index);
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
        () => {
          this.snackBar.open("❌ Cep não encontrado", "OK", {
            duration: 2000
          });
        }
      );
    }
  }

  populaDadosCep(dados) {
    this.locationForm.patchValue({
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
    this.locationForm.patchValue({
      cep: cep,
      bairro: null,
      cidade: null,
      estado: null,
      endereco: null,
      numero: null,
      complemento: null
    });
  }

  nextStep(stepper: any) {
    stepper.next();
    this.startMap();
  }

  async create() {
    try {
      if (
        this.generalForm.invalid ||
        this.locationForm.invalid ||
        this.partesForm.invalid
      ) {
        return;
      }
      const moment_date = moment(this.generalForm.controls.data.value).format(
        "DD/MM/YYYY"
      );
      const hour = this.generalForm.controls.hora.value;
      const moment_hour = moment(hour, "hh:mm a").format("HH:mm");
      const pronto = moment(
        `${moment_date} ${moment_hour}`,
        "DD/MM/YYYY HH:mm"
      );
      const dados = {
        ...this.generalForm.getRawValue(),
        ...this.locationForm.getRawValue(),
        ...this.partesForm.getRawValue(),
        visita: pronto,
        status: "Em aberto"
      };
      const response = await this.vistoriaService.create(dados);
      await this.laudoService.create({ vistoria: response["_id"] });
      this.snackBar.open(`✔️ Vistoria Solicitada com sucesso!`, "Ok", {
        duration: 3000
      });
      this.router.navigate(["/dashboard/solicitacoes"]);
    } catch (error) {
      this.snackBar.open("❌ Erro ao solicitar a vistoria", "Ok", {
        duration: 3000
      });
    }
  }
}
