import { Routes } from '@angular/router';
import { SignUpComponent } from './features/form/sign-up/sign-up.component';
import { LoginComponent } from './features/form/login/login.component';

export const routes: Routes = [
    {
        path: 'sign-up',
        loadComponent: () => import ('../app/features/form/sign-up/sign-up.component').then((s) => s.SignUpComponent),
        title: 'Register'
    },
    {
        path: 'login',
        loadComponent: () => import ('../app/features/form/login/login.component').then(l => l.LoginComponent),
        title: 'Login',
    }
];
