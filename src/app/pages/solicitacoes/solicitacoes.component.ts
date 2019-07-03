import { Component, ViewChild, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog
} from "@angular/material";
import { merge, of as observableOf } from "rxjs";
import { UserService } from "src/app/services/user/user.service";
import { Vistoria } from "src/app/models/vistoria";
import { environment } from "src/environments/environment";
import { VistoriaService } from "src/app/services/vistoria/vistoria.service";
import { Laudo } from "src/app/models/laudo";
import { SolicitacoesEditModalComponent } from "./solicitacoes-edit-modal/solicitacoes-edit-modal.component";

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
  status: any;
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
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
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
    this.vistoriaService.getAll("", "", "", "").subscribe(res => {
      this.vistorias = res;
      console.log(this.vistorias);
    });
  }

  edit(item: any) {
    const dialogRef = this.dialog.open(SolicitacoesEditModalComponent, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dados) {
        this.vistoriaService.update(result.dados).subscribe(
          (val: any) => {
            const index = this.data.findIndex(item => item.id === result.id);
            const newArray = [...this.data];
            newArray[index] = val;

            this.data = newArray;
            this.loadVistorias();

            this.cdr.detectChanges();
            this.snackBar.open("✔ Vistoria alterada com sucesso", "Ok", {
              duration: 5000
            });
          },
          error => {
            this.snackBar.open(`❌ ${error.error.message}`, "Ok", {
              duration: 5000
            });
          }
        );
      }
    });
  }
}
