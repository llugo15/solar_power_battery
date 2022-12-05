import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/register/auth.service';
import { FirebaseService } from '../shared/firebase.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit, OnDestroy {
  private userSub: Subscription;
  private appSub: Subscription;
  isAuth = false;
  name: string;

  constructor(private auth: AuthService,
              private firebase: FirebaseService) { }

  // calling the database functions so that they can be ran
  ngOnInit() {
    this.firebase.fetchAC();
    this.firebase.fetchDC();
    this.firebase.fetchPower();
    this.firebase.batteryLvl();
    console.log("Loaded OverviewPage");

    // getting the current user
    this.userSub = this.auth.user.subscribe(
      (user) => {
        this.isAuth = !!user; // this says true or false, true when we have a user and false otherwise
      }
    );

    // getting the current system name 
    this.appSub = this.firebase.appName.subscribe(
      (appName) => {
      this.name = appName;
    });
  }

  // loging the user out 
  logout() {
    this.auth.logout();
  }

  // writing the name the user names their system 
  writeName() {
    localStorage.setItem('appName', this.name);
  }

  // destroying self made subscriptions
  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.appSub.unsubscribe();
  }

}
