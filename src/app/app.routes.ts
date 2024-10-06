import { Routes } from '@angular/router';
import { PostListComponent } from './pages/post-list/post-list.component';
import { PostComponent } from './shared/features/post/post.component';
import { PostModalComponent } from './shared/features/post-modal/post-modal.component';
import { PostDetailComponent } from './pages/post-detail/post-detail.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./pages/sign-up/sign-up.component').then(
        (s) => s.SignUpComponent
      ),
    title: 'Register',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((l) => l.LoginComponent),
    title: 'Login',
    // canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/user-profile/user-profile.component').then(p => p.UserProfileComponent),
    title: 'Profile'
  },
  {
    path: 'create-post',
    loadComponent: () => import('./shared/features/post-modal/post-modal.component').then(pm => pm.PostModalComponent),
    title: 'Create a post',
    // canActivate: [authGuard],
  },
  {
    path: 'edit-post/:id',
    loadComponent: () => import('./shared/features/post-modal/post-modal.component').then(pm => pm.PostModalComponent),
    title: 'Edit post',
    // canActivate: [authGuard],
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./pages/post-detail/post-detail.component').then(d => d.PostDetailComponent),
    title: 'Post',
    // canActivate: [authGuard],


    // path: 'post/:id',
    // loadComponent: () => import('./pages/post-detail/post-detail.component').then(d => d.PostDetailComponent),
    // // loadComponent: () => import('./pages/post-detail/post-detail.component').then(d => d.PostDetailComponent),
    // title: 'Post',
  },
  {
    path: '',
    loadComponent: () => import('./pages/post-list/post-list.component').then(pl => pl.PostListComponent),
    title: 'PostList'
  },

];
