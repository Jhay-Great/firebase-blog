import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  console.log('called route guard');
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('this is runnings')

  const user = authService.getUserAccessToken();
  // let authenticated;
  return user.pipe(
    map(data => {
      console.log(data, data.uid);
      if (!data ) {
        router.navigate(['']);
        return false;
      }
      return true;
    })
  )

  // const authenticated = authService.access();
  // console.log('logging route guard access: ', authenticated)

  // console.log('checking authentication: ', authenticated)
  // if (!authenticated) {
  //   router.navigate(['/login']);
  //   return false;
  // }
  
  // return true;
};
