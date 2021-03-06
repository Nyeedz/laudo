import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild
} from "@angular/core";
import {
  MatDialog,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource
} from "@angular/material";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { merge, of as observableOf } from "rxjs";
import { EmpresaCredenciada } from "src/app/models/empresaCredenciada";
import { EmpresaCredenciadaService } from "src/app/services/empresa-credenciada/empresa-credenciada.service";
import { UploadService } from "../../services/upload/upload.service";
import { EmpresaCredenciadaCreateModalComponent } from "./empresa-credenciada-create-modal/empresa-credenciada-create-modal.component";
import { EmpresaCredenciadaEditModalComponent } from "./empresa-credenciada-edit-modal/empresa-credenciada-edit-modal.component";
import { UserService } from "src/app/services/user/user.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-empresa-credenciada",
  templateUrl: "./empresa-credenciada.component.html",
  styleUrls: ["./empresa-credenciada.component.scss"]
})
export class EmpresaCredenciadaComponent implements AfterViewInit, OnDestroy {
  @ViewChild("deleteSwal") private deleteSwal: SwalComponent;

  displayedColumns: string[] = [
    "logotipo",
    "cnpj",
    "nome_fantasia",
    "empresacons",
    "razao_social",
    "email",
    "telefone",
    "ações"
  ];

  dataSource = new MatTableDataSource();
  data: EmpresaCredenciada[];
  empresacons: any;

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  selectedId: string;
  credenciado = false;
  admin = false;

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
    private empresaCredenciadaService: EmpresaCredenciadaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private upload: UploadService,
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getMe().subscribe(
      user => {
        if (user["role"]["_id"] === environment.adminId) {
          this.admin = true;
          this.credenciado = user["adminCredenciado"];
        }
      },
      () => {
        this.admin = false;
      }
    );
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Registros por página";
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    this.loadEmpresas();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadEmpresas();
    });
  }

  loadEmpresas() {
    this.isLoadingResults = true;
    this.empresaCredenciadaService
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
            this.empresacons = value["empresacons"];
          });
          this.resultsLength = pageSize;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
        },
        error => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;

          return observableOf([]);
        }
      );
  }

  ngOnDestroy() {
    this.cdr.detach();
  }

  applyFilter(filterValue: string, type: string) {
    this.filter[type] = filterValue;
    this.loadEmpresas();
    this.sort.sortChange.emit();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  create(dados?: any) {
    const dialogRef = this.dialog.open(EmpresaCredenciadaCreateModalComponent, {
      data: dados
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result.dados);
      if (result && result.dados) {
        this.empresaCredenciadaService.create(result.dados).subscribe(
          empresa => {
            if (result.file) {
              const arquivo = new FormData();
              arquivo.append("ref", "empresacre");
              arquivo.append("refId", empresa["id"]);
              arquivo.append("field", "logotipo");
              arquivo.append("files", result.file);

              this.upload.send(arquivo).subscribe(res => {
                this.loadEmpresas();
              });
            }

            this.loadEmpresas();
            this.snackBar.open("✔ Empresa criada com sucesso", "Ok", {
              duration: 5000
            });
          },
          error => {
            this.snackBar.open(`❌ ${error.error.message}`, "Ok", {
              duration: 300
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
    const dialogRef = this.dialog.open(EmpresaCredenciadaEditModalComponent, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dados) {
        this.empresaCredenciadaService.update(result.dados).subscribe(
          (val: EmpresaCredenciada) => {
            const index = this.data.findIndex(item => item.id === result.id);
            const newArray = [...this.data];
            newArray[index] = val;
            this.data = newArray;

            if (result.file) {
              const arquivo = new FormData();
              arquivo.append("ref", "empresacre");
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

  confirmDelete() {
    if (!this.selectedId) {
      return;
    }

    this.empresaCredenciadaService.delete(this.selectedId).subscribe(
      () => {
        this.data = this.data.filter(item => item.id !== this.selectedId);
        this.resultsLength -= 1;
        this.selectedId = null;
        this.snackBar.open("✔ Empresa excluida com sucesso", "Ok", {
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
}
