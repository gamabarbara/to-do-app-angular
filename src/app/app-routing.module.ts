import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// http://localhost:4200/ -> http://localhost:4200/todos
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'todos'
  },
  {
    path: 'todos',
    loadChildren: () => import('./todos/todos.module').then(m => m.TodosModule) // Lazy loading 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
