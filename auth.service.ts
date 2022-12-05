import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    errorMessage = null;
    user = new BehaviorSubject<User>(null); // subject which we can subscribe and get information whenever new data is emitted
    // behvaioralsubject gives access to the past user (immediately)
    private tokenExpirationTimer: any;

    constructor(private router: Router){}
    
    // Used to signup, creates a new user
    signup(email: string, password: string) {
        const auth = getAuth();
        return createUserWithEmailAndPassword(auth, email, password)
        .then( async (respData) => {
          let token = await respData.user.getIdToken();
          this.handleAuthentication(respData.user.email, respData.user.uid, token, 3600);
          this.router.navigate(['/overview']);
        });
    }

    // authentication for the user
    private handleAuthentication(email: string, localId: string, token: string, expiresIn: number) {
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user = new User(email, localId, token, expirationDate);
      // this.firebase.createUser(user);
      this.user.next(user);
      this.autoLogout(expiresIn * 1000);
      localStorage.setItem('userData', JSON.stringify(user));
    }

    // auto login 
    autoLogin() {
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpiration: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return;
      }   

      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpiration));

      if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpiration).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    }

    // used for login
    login(email: string, password: string) {
      const auth = getAuth();
      return signInWithEmailAndPassword(auth, email, password)
      .then( async (respData) => {
        let token = await respData.user.getIdToken();
        this.handleAuthentication(respData.user.email, respData.user.uid, token, 3600);
        this.router.navigate(['/overview']);
    });
    }

    // used to logout after a certain mount of time, also logs out the user 
    logout() {
      const auth = getAuth();
      signOut(auth).then(
        (resp) => {
          this.user.next(null);
          this.router.navigate(['/auth']);
          localStorage.removeItem('userData');
          if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
          }
          this.tokenExpirationTimer = null;
          console.log("Successful Logout: ", resp);
        }).catch(
          (resp) => {
            console.log("Unsuccessful Logout: ", resp);
          }
        )
    }

    // auto logout
    autoLogout(expirationDuration: number) {
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      }, expirationDuration)
    }
}



