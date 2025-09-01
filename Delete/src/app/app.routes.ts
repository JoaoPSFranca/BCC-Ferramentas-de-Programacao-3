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
    path: 'cadastro-produto',
    loadComponent: () => import('./cadastro-produto/cadastro-produto.page').then( m => m.CadastroProdutoPage)
  },
];
