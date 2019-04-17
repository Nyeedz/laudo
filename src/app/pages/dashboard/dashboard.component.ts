import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { User } from "../../models/user";
import { AuthenticationService } from "../../services/authentication/authentication.service";
import { UserService } from "../../services/user/user.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  @ViewChild("drawer") drawer: MatDrawer;
  currentUser: User;
  currentUserSubscription: Subscription;
  credenciado: boolean = false;
  adminCredenciado: boolean = false;
  adminContratante: boolean = false;
  contratante: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getMe().subscribe(
      user => {
        this.adminCredenciado = user["adminCredenciado"];
        this.adminContratante = user["adminContratante"];
      },
      error => {
        this.adminCredenciado = false;
        this.adminContratante = false;
        console.log(error);
      }
    );
  }

  deleteUser(id: number) {
    this.userService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.loadUser();
      });
  }

  drawerToggle() {
    this.drawer.toggle();
  }

  private loadUser() {
    this.userService.getMe();
  }
}
