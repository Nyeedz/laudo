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
    "razao_social",
    "email",
    "telefone",
    "ações"
  ];

  dataSource = new MatTableDataSource();
  data: EmpresaCredenciada[];

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  selectedId: string;

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
    private cdr: ChangeDetectorRef
  ) {}

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

  create(dados: any) {
    const dialogRef = this.dialog.open(EmpresaCredenciadaCreateModalComponent, {
      data: dados
    });

    dialogRef.afterClosed().subscribe(result => {
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
                console.log(res);
                this.loadEmpresas();
              });
            }

            this.loadEmpresas();
            this.snackBar.open("✔ Empresa criada com sucesso", "Ok", {
              duration: 5000
            });
          },
          error => {
            this.snackBar.open("❌ Erro ao cadastrar empresa", "Ok", {
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
                console.log(res);
                this.loadEmpresas();
              });
            }

            this.cdr.detectChanges();
            this.snackBar.open("✔ Empresa alterada com sucesso", "Ok", {
              duration: 5000
            });
          },
          err => {
            this.snackBar.open("❌ Erro ao editar empresa", "Ok", {
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
      err => {
        this.snackBar.open("❌ Erro ao excluir empresa", "Ok", {
          duration: 5000
        });
      }
    );
  }
}
