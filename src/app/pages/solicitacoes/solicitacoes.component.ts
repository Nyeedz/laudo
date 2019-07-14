import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource
} from "@angular/material";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { Laudo } from "../../models/laudo";
import { Vistoria } from "../../models/vistoria";
import { UserService } from "../../services/user/user.service";
import { VistoriaService } from "../../services/vistoria/vistoria.service";

@Component({
  selector: "app-solicitacoes",
  templateUrl: "./solicitacoes.component.html",
  styleUrls: ["./solicitacoes.component.scss"]
})
export class SolicitacoesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    "status",
    "tipos_laudo",
    "cep",
    "endereco",
    "bairro",
    "cidade",
    "ações"
  ];

  dataSource = new MatTableDataSource();
  data: Vistoria[];
  status: boolean = false;
  vistoria: Vistoria;
  filter: {
    status: string;
    tipos_laudo: string;
  } = {
    status: null,
    tipos_laudo: null
  };

  vistorias: Vistoria[] = [];
  laudo: Laudo;
  constructor(
    private userService: UserService,
    private vistoriaService: VistoriaService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user.user.role._id === environment.adminId) {
      this.loadVistorias();
    } else {
      this.userService.getMe().subscribe(result => {
        this.vistorias = result.vistorias || [];

        if (this.vistorias.length > 0) {
          this.loadVistorias();
        }
      });
    }
  }

  loadVistorias() {
    this.vistoriaService.getAll("status:desc", "", "", "").subscribe(res => {
      this.vistorias = res;
      console.log(this.vistorias)
    });
  }

  async seeLaudo(vistoria: any) {
    try {
      if (!vistoria.laudo) {
        throw Error("n tem laudo");
      }

      this.router.navigate([`dashboard/vistoria/${vistoria.laudo._id}`]);
      // const res = await this.laudoService.findOne(item.laudo.id);

      // console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
}
