import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
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
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild("drawer") drawer: MatDrawer;
  currentUser: User;
  currentUserSubscription: Subscription;
  credenciado: boolean = false;
  admin: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
        if (
          this.currentUser["user"]["role"]["_id"] === environment.credenciadoId
        ) {
          this.admin = false;
          this.credenciado = true;
        } else if (
          this.currentUser["user"]["role"]["id"] === environment.adminId
        ) {
          this.admin = true;
          this.credenciado = false;
        }
      }
    );
  }

  ngOnInit() {
    console.log(this.credenciado);
    this.loadUser();
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
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
