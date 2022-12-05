import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  isLoginMode = true;
  errorMessage = null;
  errorCode = null;
  constructor(private auth: AuthService,
              private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  //  Used to switch from logging in to signing up
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  // Used to show the loading alert
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 1000,
    });

    loading.present();
  }

  //  Used to submit the form
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    // checking ifthe user is logged in or not and if there is an error
    if (this.isLoginMode) {
      this.auth.login(form.value.email, form.value.password)
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
        console.log(this.errorMessage);
      });
    } else {
      this.auth.signup(form.value.email, form.value.password)
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
        console.log(this.errorMessage);
      });
    }
    // resetting the form
    form.reset();
  }

}
