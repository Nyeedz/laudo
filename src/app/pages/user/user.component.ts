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
import { User } from "../../models/user";
import { UploadService } from "../../services/upload/upload.service";
import { UserService } from "../../services/user/user.service";
import { UserModalCreateComponent } from "./user-modal-create/user-modal-create.component";
import { UserEditModalComponent } from "./user-edit-modal/user-edit-modal.component";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements AfterViewInit, OnDestroy {
  @ViewChild("deleteSwal") private deleteSwal: SwalComponent;

  displayedColumns: string[] = [
    "foto",
    "nome",
    "email",
    "cep",
    "cidade",
    "ações"
  ];

  dataSource = new MatTableDataSource();
  data: User[];
  users: any;

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;
  selectedId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filter: {
    nome: string;
    email: string;
  } = {
    nome: null,
    email: null
  };

  constructor(
    private userService: UserService,
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

    this.loadUsers();

    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.loadUsers();
    });
  }

  loadUsers() {
    this.isLoadingResults = true;
    this.userService
      .dataSource(undefined, this.paginator.pageIndex * 10, 10, {
        nome: this.filter.nome,
        email: this.filter.email
      })
      .subscribe(
        res => {
          const [users, pageSize] = res;

          this.data = users;
          this.data.map(value => {
            this.users = value["users"];
          });
          this.resultsLength = 0;
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
        },
        () => {
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
    this.loadUsers();
    this.sort.sortChange.emit();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  create(dados: any) {
    const dialogRef = this.dialog.open(UserModalCreateComponent, {
      data: dados
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dados) {
        const contratantes = result.dados.empresacons.map(empresa => {
          return { _id: empresa };
        });
        const credenciadas = result.dados.empresacres.map(empresa => {
          return { _id: empresa };
        });
        const users = {
          ...result.dados,
          empresacons: contratantes,
          empresacres: credenciadas
        };

        this.userService.register(users).subscribe(
          async user => {
            if (credenciadas.length > 0 || contratantes.length > 0) {
              this.userService
                .update(
                  { empresacons: contratantes, empresacres: credenciadas },
                  user["user"]["id"]
                )
                .subscribe(() => {
                  this.loadUsers();
                });
            } else {
              this.loadUsers();
              this.snackBar.open("✔ Usuário criado com sucesso", "Ok", {
                duration: 5000
              });
            }

            if (result.file) {
              const arquivo = new FormData();
              arquivo.append("ref", "user");
              arquivo.append("refId", user["user"]["id"]);
              arquivo.append("field", "foto");
              arquivo.append("files", result.file);
              arquivo.append("path", "/user/avatar");
              arquivo.append("source", "users-permissions");

              this.upload.send(arquivo).subscribe(res => {
                this.loadUsers();
              });
            }
          },
          () => {
            this.snackBar.open("❌ Erro ao cadastrar usuário", "Ok", {
              duration: 300
            });
          }
        );
      }
    });
  }

  delete(row: any) {
    this.selectedId = row._id;
    this.deleteSwal.show();
  }

  edit(item: any) {
    const dialogRef = this.dialog.open(UserEditModalComponent, {
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dados) {
        const contratantes = result.dados.empresacons.map(empresa => {
          return { _id: empresa };
        });

        const credenciadas = result.dados.empresacres.map(empresa => {
          return { _id: empresa };
        });

        const user = {
          ...result.dados,
          empresacons: contratantes,
          empresacres: credenciadas
        };

        this.userService.update(user, user._id).subscribe(
          val => {
            const index = this.data.findIndex(item => item.id === result.id);
            const newArray: any = [...this.data];
            newArray[index] = val;
            this.data = newArray;

            if (result.file) {
              const arquivo = new FormData();
              arquivo.append("ref", "user");
              arquivo.append("refId", result["dados"]["_id"]);
              arquivo.append("field", "foto");
              arquivo.append("files", result.file);
              arquivo.append("path", "/user/avatar");
              arquivo.append("source", "users-permissions");

              this.upload.send(arquivo).subscribe(res => {
                this.loadUsers();
              });
            }

            this.loadUsers();
            this.cdr.detectChanges();
            this.snackBar.open("✔ Usuário alterado com sucesso", "Ok", {
              duration: 5000
            });
          },
          err => {
            console.log(err);
            this.snackBar.open("❌ Erro ao editar usuário", "Ok", {
              duration: 5000
            });
          }
        );
      }
    });
  }

  confirmDelete() {
    if (!this.selectedId) {
      console.log(this.selectedId);
      return;
    }

    this.userService.delete(this.selectedId).subscribe(
      () => {
        this.data = this.data.filter(item => item["_id"] !== this.selectedId);
        this.resultsLength -= 1;
        this.selectedId = null;
        this.snackBar.open("✔ Usuário excluido com sucesso", "Ok", {
          duration: 5000
        });
      },
      err => {
        this.snackBar.open("❌ Erro ao excluir usuário", "Ok", {
          duration: 5000
        });
      }
    );
  }
}
