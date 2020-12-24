import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {HttpResponse} from "@angular/common/http";
import {HttpHeaders} from "@angular/common/http";
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OverPrint';

  Name = '';
  data = '';
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(res => {
      this.Name = res.name;
    });


  let loginstatusUrl = environment.baseUrl + '/office/login'; 
  this.http.get<any>(loginstatusUrl, { withCredentials:true } ).subscribe({
    next: data => {
        this.router.navigate(['list']);
    },
    error: error => {
        //this.errorMessage = error.message;
        //console.error('There was an error!', error);
        this.router.navigate(['login']);
    }
  })

  }



}
