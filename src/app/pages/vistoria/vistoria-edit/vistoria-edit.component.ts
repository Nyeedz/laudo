import {
  Component,
  OnInit,
  ViewChild,
  ɵConsole,
  ChangeDetectorRef
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatStepper } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import { LaudoService } from '../../../services/laudo/laudo.service';
import { UserService } from '../../../services/user/user.service';
import { ViaCepService } from '../../../services/viaCep/via-cep.service';
import { VistoriaService } from '../../../services/vistoria/vistoria.service';
import { AmbienteService } from '../../../services/ambiente/ambiente.service';
import { FlatTreeControl } from '@angular/cdk/tree';
declare var ol;

export class DynamicFlatNode {
  constructor(
    public item: string,
    public level = 1,
    public expandable = false,
    public isLoading = false
  ) {}
}

@Component({
  selector: "app-vistoria-edit",
  templateUrl: "./vistoria-edit.component.html",
  styleUrls: ["./vistoria-edit.component.scss"]
})
export class VistoriaEditComponent implements OnInit {
  id: string;
  laudoId: string;
  laudo: any;
  showMap = false;

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
  itemForm: FormGroup;
  partesForm: FormGroup;
  ambienteForm: FormGroup;

  newImage: string;

  partes: FormArray;

  ambientes: any;
  users: any;
  selectedAmbiente: any;

  tipos_laudo = [
    { value: "Vistoria locativa de entrada" },
    { value: "Vistoria locativa de saida" },
    { value: "Vistoria cautelar de vizinhança" },
    { value: "Parecer técnico" },
    { value: "Laudo judicial" },
    { value: "Laudo de constatação" }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private viaCepService: ViaCepService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private vistoriaService: VistoriaService,
    private router: Router,
    private laudoService: LaudoService,
    private ambienteService: AmbienteService,
    private userService: UserService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.loadVistoria();

    this.userService.get().subscribe(result => {
      this.users = result;
    });
  }

  buildForm() {
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

    this.ambienteForm = this.formBuilder.group({
      nome: ['', Validators.required]
    });
  }

  async loadVistoria() {
    try {
      this.laudoId = this.activatedRoute.snapshot.paramMap.get("id");
      const laudo = await this.laudoService.findOne(this.laudoId);
      const vistoria = laudo.vistoria;
      this.laudo = laudo;
      this.id = laudo.vistoria._id;

      this.locationForm.patchValue(vistoria);
      this.generalForm.patchValue({
        ...vistoria,
        data: moment(vistoria.visita).toISOString(),
        hora: moment(vistoria.visita).format("hh:mm a")
      });

      vistoria.partes.forEach((parte, i) => {
        this.addParte();
        const partesForm = this.partesForm.get("partes") as FormArray;
        partesForm.at(i).patchValue(parte);
      });

      this.loadAmbientes();

      setTimeout(() => {
        this.partesForm.patchValue(vistoria.partes);
      }, 2000);

      this.cdr.detectChanges();
    } catch (err) {
      console.log(err);
    }
  }

  async loadAmbientes() {
    try {
      const ambientes = await this.ambienteService.findByLaudo(this.laudoId);

      this.selectAmbiente(ambientes[0]);
      this.ambientes = ambientes;
    } catch (err) {
      console.log(err);
    }
  }

  selectAmbiente(ambiente: any) {
    this.selectedAmbiente = ambiente;

    this.ambienteForm.patchValue({
      nome: ambiente.nome
    });

    this.newImage = null;
  }

  async saveAmbiente() {
    try {
      const ambiente = this.ambienteForm.getRawValue();

      const updated = await this.ambienteService.update(
        ambiente,
        this.selectedAmbiente.id
      );

      const index = this.ambientes.findIndex(
        ambiente => ambiente._id == updated['_id']
      );

      this.selectedAmbiente = updated;
      this.ambientes[index] = updated;

      console.log(this.ambientes);
    } catch (err) {}
  }

  async imageChange(event) {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();

      reader.onload = e => {
        this.newImage = e.target['result'];
      };

      reader.readAsDataURL(event.target.files[0]);
    }
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
  }

  async update() {
    try {
      if (
        this.locationForm.invalid ||
        this.generalForm.invalid ||
        this.partesForm.invalid
      ) {
        return;
      }

      const locationRaw = this.locationForm.getRawValue();
      const generalRaw = this.generalForm.getRawValue();
      const partesRaw = this.partesForm.getRawValue();
      const date = moment(generalRaw.data).format("DD/MM/YYYY");
      const hora = moment(generalRaw.hora, "hh:mm a").format("hh:mm a");
      const fullDate = moment(`${date} ${hora}`, "DD/MM/YYYY hh:mm a");

      const data = {
        ...locationRaw,
        ...generalRaw,
        ...partesRaw,
        visita: fullDate,
        status: "Finalizado"
      };

      delete data.data;
      delete data.hora;

      const response = await this.vistoriaService
        .update(data, this.id)
        .toPromise();

      this.snackBar.open(
        `✔️ Vistoria finalizada
       com sucesso!`,
        "Ok",
        {
          duration: 3000
        }
      );
      this.router.navigate(["/dashboard/solicitacoes"]);
    } catch (error) {
      this.snackBar.open("❌ Erro ao solicitar a vistoria", "Ok", {
        duration: 3000
      });
    }
  }
}
