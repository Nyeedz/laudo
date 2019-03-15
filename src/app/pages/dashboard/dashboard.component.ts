import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { User } from "src/app/models/user";
import { AuthenticationService } from "src/app/services/authentication/authentication.service";
import { UserService } from "src/app/services/user/user.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  user: Object;
  idUser: any;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(
      user => {
        this.currentUser = user;
      }
    );
    this.idUser = JSON.parse(localStorage.getItem("currentUser"));
  }

  ngOnInit() {
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

  private loadUser() {
    this.userService.getMe();
  }
}
