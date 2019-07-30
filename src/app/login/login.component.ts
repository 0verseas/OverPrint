import { Component, OnInit } from '@angular/core';
import { sha256, sha224 } from 'js-sha256';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  //private router = ActivatedRoute;
  Name = '';
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(res => {
      this.Name = res.name;
      console.log(res.name);
    });
  }

  ngOnInit() {
  }

  btn_login():void{
    const data = {username: this.username, password: sha256(this.password)};
    console.log(data);

    const req = this.http.post(environment.baseUrl + '/office/login', {
      username: this.username,
      password: sha256(this.password)
    })
      .subscribe(
        res => {
          //console.log(res);
          console.log("登入成功");
          this.router.navigate(['list']);
        },
        err => {
          console.log("Error occured");
          alert("帳號或密碼錯誤")
        }
      );
  }

}
