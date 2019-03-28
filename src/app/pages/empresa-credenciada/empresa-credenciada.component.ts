import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatSnackBar,
  MatDialogRef,
  MatDialog
} from "@angular/material";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { merge, of as observableOf } from "rxjs";
import { EmpresaCredenciada } from "src/app/models/empresaCredenciada";
import { EmpresaCredenciadaService } from "src/app/services/empresa-credenciada/empresa-credenciada.service";
import { EmpresaCredenciadaEditModalComponent } from "./empresa-credenciada-edit-modal/empresa-credenciada-edit-modal.component";

@Component({
  selector: "app-empresa-credenciada",
  templateUrl: "./empresa-credenciada.component.html",
  styleUrls: ["./empresa-credenciada.component.scss"]
})
export class EmpresaCredenciadaComponent implements AfterViewInit, OnDestroy {
  @ViewChild("deleteSwal") private deleteSwal: SwalComponent;

  displayedColumns: string[] = [
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
  isLoadingResults = true;
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
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
    });

    this.loadEmpresas();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadEmpresas();
    });
  }

  loadEmpresas() {
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

  delete(id: any) {
    this.selectedId = id;
    this.deleteSwal.show();
  }

  edit(item: any) {
    const dialogRef = this.dialog.open(EmpresaCredenciadaEditModalComponent, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresaCredenciadaService.update(result).subscribe(
          (val: EmpresaCredenciada) => {
            const index = this.data.findIndex(item => item.id === result.id);
            const newArray = [...this.data];
            newArray[index] = val;
            this.data = newArray;
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
    if (!this.selectedId) return;

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