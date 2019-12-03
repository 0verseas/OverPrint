import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { SearchStudentPipe } from './search-student.pipe';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignComponent } from './sign/sign.component';
import {MatDialogModule} from '@angular/material/dialog';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'list', component: ListComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    SearchStudentPipe,
    LoginComponent,
    SignComponent,
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SignComponent],
})
export class AppModule { }
