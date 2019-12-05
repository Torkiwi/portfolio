import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class DirectAccessGuard implements CanActivate {

	constructor(
		private router: Router,
	) {
	}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

		if (environment.production && this.router.url === '/') {
			this.router.navigate(['home']); // Navigate away to some other page
			return false;
		}
		return true;
	}

}
