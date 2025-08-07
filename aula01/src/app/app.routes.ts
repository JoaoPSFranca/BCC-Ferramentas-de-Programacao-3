import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'pessoa-list',
    loadComponent: () => import('./pessoa-list/pessoa-list.page').then( m => m.PessoaListPage)
  },
];
