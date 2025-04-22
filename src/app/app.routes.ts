import { Routes } from '@angular/router';
import { LoginComponent } from './pages/Auth/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './guards/auth.guard';
import { PostsListComponent } from './pages/posts-list/posts-list.component';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
    },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        canActivate: [AuthGuard]
    },
    {
        path: 'posts',
        component: PostsListComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '404',
        component: NotFoundComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: '/404'
    }
];

