import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessTodosGuard implements CanActivate {

  constructor (
    private authService: AuthService,
    private router: Router,
    ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser
    .pipe(
      map(user => {
        // Se user igual nulo, não há nenhum usuário logado e a pessoa será redirecionada para a página de login
        if(user == null)  {
          return this.router.parseUrl('auth/login')
        }
        // Se a pessoa está logada, mas ainda não verificou o email dela, ela será redirecionada para a página informando que ela precisa verificar seu email
        if(!user.emailVerified) {
          user.sendEmailVerification()
          return this.router.parseUrl('auth/verify-email')
        }
        return true
      })
    )
  }
  
}
