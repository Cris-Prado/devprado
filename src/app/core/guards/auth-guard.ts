import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
export const authChildGuard: CanActivateChildFn = async (_route, state) => {
 const auth = inject(AuthService); // inject antes de await
 const router = inject(Router);
 try {
 await auth.ready;
 } catch {
 return router.createUrlTree(['/login']);
 }
 return auth.isAuthenticated()
 ? true
 : router.createUrlTree(['/login'], {
 queryParams: { returnUrl: state.url },
 });
};