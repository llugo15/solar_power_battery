import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { map, take } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private auth: AuthService,
                private router: Router) {}

        // used to make sure the user cant access other pages if not signed in
    canActivate(
        route: ActivatedRouteSnapshot, 
        router: RouterStateSnapshot)
        : boolean 
        | UrlTree
        | Promise<boolean | UrlTree> 
        | Observable<boolean | UrlTree> 
        {
            return this.auth.user.pipe(
                take(1),
                map(user => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);
            }));
        }
}