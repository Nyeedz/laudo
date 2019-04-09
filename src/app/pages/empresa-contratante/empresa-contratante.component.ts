import {
  AfterViewInit,
  Component,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialog
} from "@angular/material";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { merge, of as observableOf } from "rxjs";
import { EmpresaContratante } from "../../models/empresaContratante";
import { EmpresaContratanteService } from "../../services/empresa-contratante/empresa-contratante.service";
import { EmpresaContratanteEditModalComponent } from "./empresa-contratante-edit-modal/empresa-contratante-edit-modal.component";
import { EmpresaContratanteCreateModalComponent } from "./empresa-contratante-create-modal/empresa-contratante-create-modal.component";
import { UploadService } from "src/app/services/upload/upload.service";
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "app-empresa-contratante",
  templateUrl: "./empresa-contratante.component.html",
  styleUrls: ["./empresa-contratante.component.scss"]
})
export class EmpresaContratanteComponent implements AfterViewInit, OnDestroy {
  @ViewChild("deleteSwal") private deleteSwal: SwalComponent;

  displayedColumns: string[] = [
    "logotipo",
    "cnpj",
    "nome_fantasia",
    "empresacres",
    "razao_social",
    "email",
    "telefone",
    "ações"
  ];
  dataSource = new MatTableDataSource();
  data: EmpresaContratante[];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  selectedId: string;
  empresacres: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filter: {
    cnpj: string;
    nomeFantasia: string;
    razaoSocial: string;
    email: string;
  } = {
    cnpj: null,
    nomeFantasia: null,
    razaoSocial: null,
    email: null
  };

  constructor(
    private empresaContratanteService: EmpresaContratanteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private upload: UploadService,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.loadEmpresas();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadEmpresas();
    });
  }

  ngOnDestroy() {
    this.cdr.detach();
  }

  loadEmpresas() {
    this.empresaContratanteService
      .dataSource(undefined, this.paginator.pageIndex * 10, 10, {
        cnpj: this.filter.cnpj,
        nomeFantasia: this.filter.nomeFantasia,
        razaoSocial: this.filter.razaoSocial,
        email: this.filter.email
      })
      .subscribe(
        res => {
          const [empresa, pageSize] = res;

          this.data = empresa;
          this.data.map(value => {
            this.empresacres = value["empresacres"];
          });
          this.resultsLength = pageSize;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
        },
        error => {
          this.isLoadingResults = false;
          this.isLoadingResults = true;
          return observableOf([]);
        }
      );
  }

  applyFilter(filterValue: string, type: string) {
    this.filter[type] = filterValue;
    this.loadEmpresas();
    this.sort.sortChange.emit();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  create(dados: any) {
    const dialogRef = this.dialog.open(EmpresaContratanteCreateModalComponent, {
      data: dados
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dados) {
        this.empresaContratanteService.create(result.dados).subscribe(
          empresa => {
            if (result.file) {
              const arquivo = new FormData();
              arquivo.append("ref", "empresacon");
              arquivo.append("refId", empresa["id"]);
              arquivo.append("field", "logotipo");
              arquivo.append("files", result.file);

              this.upload.send(arquivo).subscribe(res => {
                this.loadEmpresas();
              });
            }

            const user = JSON.parse(localStorage.getItem("currentUser"));
            const body = {
              empresacons: [{ _id: empresa["_id"] }]
            };
            this.userService.update(user.user._id, body).subscribe(
              () => {},
              error => {
                console.log(error);
              }
            );

            this.loadEmpresas();
            this.snackBar.open(`✔ Sua Empresa foi criada com sucesso`, "Ok", {
              duration: 3000
            });
          },
          error => {
            this.snackBar.open(`❌ ${error.error.message}`, "Ok", {
              duration: 3000
            });
          }
        );
      }
    });
  }

  delete(id: any) {
    this.selectedId = id;
    this.deleteSwal.show();
  }

  edit(item: any) {
    const dialogRef = this.dialog.open(EmpresaContratanteEditModalComponent, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dados) {
        this.empresaContratanteService.update(result.dados).subscribe(
          (val: EmpresaContratante) => {
            const index = this.data.findIndex(item => item.id === result.id);
            const newArray = [...this.data];
            newArray[index] = val;
            this.data = newArray;

            if (result.file) {
              const arquivo = new FormData();
              arquivo.append("ref", "empresacon");
              arquivo.append("refId", val.id);
              arquivo.append("field", "logotipo");
              arquivo.append("files", result.file);

              this.upload.send(arquivo).subscribe(res => {
                this.loadEmpresas();
              });
            }

            this.loadEmpresas();
            this.cdr.detectChanges();
            this.snackBar.open("✔ Empresa alterada com sucesso", "Ok", {
              duration: 3000
            });
          },
          error => {
            this.snackBar.open(`❌ ${error.error.message}`, "Ok", {
              duration: 3000
            });
          }
        );
      }
    });
  }

  confirmDelete() {
    if (!this.selectedId) {
      return;
    }

    this.empresaContratanteService.delete(this.selectedId).subscribe(
      res => {
        this.data = this.data.filter(item => item.id !== this.selectedId);
        this.resultsLength -= 1;
        this.selectedId = null;
        this.snackBar.open("✔ Empresa excluida com sucesso", "Ok", {
          duration: 3000
        });
      },
      error => {
        this.snackBar.open(`❌ ${error.error.message}`, "Ok", {
          duration: 3000
        });
      }
    );
  }
}
