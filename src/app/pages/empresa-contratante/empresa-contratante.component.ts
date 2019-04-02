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
import { environment } from "src/environments/environment";

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
    "razao_social",
    "email",
    "telefone",
    "ações"
  ];
  dataSource = new MatTableDataSource();
  data: EmpresaContratante[];

  private apiUrl = environment.apiUrl;

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
    private empresaContratanteService: EmpresaContratanteService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private upload: UploadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.loadEmpresas();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadEmpresas();
    });
  }

  concatUrl(img) {
    if (img === null) return "../../../assets/avatar.svg";
    return img ? this.apiUrl.concat(img) : "../../../assets/avatar.svg";
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
                console.log(res);
                this.loadEmpresas();
              });
            }

            this.loadEmpresas();
            this.snackBar.open(`✔ Empresa criada com sucesso`, "Ok", {
              duration: 3000
            });
          },
          error => {
            this.snackBar.open("❌ Erro ao cadastrar empresa", "Ok", {
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
                console.log(res);
                this.loadEmpresas();
              });
            }

            this.loadEmpresas();
            this.cdr.detectChanges();
            this.snackBar.open("✔ Empresa alterada com sucesso", "Ok", {
              duration: 3000
            });
          },
          err => {
            this.snackBar.open("❌ Erro ao editar empresa", "Ok", {
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
      err => {
        this.snackBar.open("❌ Erro ao excluir empresa", "Ok", {
          duration: 3000
        });
      }
    );
  }
}
