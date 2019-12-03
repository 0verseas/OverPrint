import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {LoginComponent} from "./login/login.component";
import {ListComponent} from "./list/list.component";

const routes: Routes = [
  // { path:'/login', component:LoginComponent},
  // { path:'/list', component:ListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes),MatDialogModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
