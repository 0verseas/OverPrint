import { Component, OnInit } from '@angular/core';
import { sha256, sha224 } from 'js-sha256';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  input_identifyingCode: string ='';
  real_identifyingCode = '';

  //private router = ActivatedRoute;
  Name = '';
  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(res => {
      this.Name = res.name;
    });
  }

  ngOnInit() {
    this.generateCode();
  }


  btn_login():void{

    if(this.input_identifyingCode.toUpperCase() !== this.real_identifyingCode){
      alert('驗證碼不正確');
      this.generateCode();
      return;
    }

    const data = {username: this.username, password: sha256(this.password)};

    const req = this.http.post(environment.baseUrl + '/office/login', {
        username: this.username,
        password: sha256(this.password)
      },{
        withCredentials: true
      })
      .subscribe(
        res => {
          //console.log(res);
          console.log("登入成功");
          this.router.navigate(['list']);
          let logoutButton = document.getElementById('log-out');
          logoutButton.style.display = 'block';
        },
        err => {
          console.log("Error occured");
          alert("帳號或密碼錯誤");
        }
      );
  }
  
  // reload 驗證碼
  identifyingCode_refresh():void{
    this.generateCode();
  }

  // 驗證碼欄位偵測 enter 即做登入功能
  input_identifyingCode_onKeydown(event) {
    if (event.key === "Enter") {
      this.btn_login();
    }
  }

  //產生圖形驗證碼
	generateCode = function(){

		//隨機產生數字
		function randomNumber(min, max){
			return Math.floor(Math.random()*(max-min)+min);  //隨機產生一個在min~max之間的整數
		}
	
		//隨機顏色色碼
		function randomColor(min, max){
			
			let r = randomNumber(min, max);
			let g = randomNumber(min, max);
			let b = randomNumber(min, max);
	
			return "rgb("+r+","+g+","+b+")";
		}

		//取得畫布物件屬性
		let canvas = <HTMLCanvasElement> document.getElementById('identifyingCanvas');
		let width = canvas.width;
		let height = canvas.height;
		let context = canvas.getContext('2d');

		//基礎設定 設置文本基線在底部  背景顏色  方形繪製
		context.textBaseline = 'bottom';
		context.fillStyle = randomColor(200,240);
		context.fillRect(0,0,width,height);

		//隨機字母表   去除相似的 1 I   0 O   
		let codeList = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

		let codeString = '';

		//雖機產生4個字母
		for(let i = 0; i<4 ; i++){
			let code = codeList[randomNumber(0,codeList.length)];
			codeString += code;

			context.fillStyle = randomColor(50,160);
			context.font = randomNumber(25,30)+ 'px Arial';  //字體大小25~30隨機

			let x = 10+i*25;
			let y = randomNumber(30,35);  //隨機高度
			let angle = randomNumber(-30,30);  //隨機旋轉角度

			context.translate(x,y);  //移動繪製初始位置
			context.rotate(angle*Math.PI/180);  //旋轉繪製初始位置

			context.fillText(code,0,0);

			context.rotate(-angle*Math.PI/180);  //返回繪製初始位置
			context.translate(-x,-y);  //返回繪製初始位置
		}

		//產生干擾線
		for(let i =0;i<2;i++){
			context.strokeStyle = randomColor(40,180);

			context.beginPath();

			context.moveTo( randomNumber(0,width), randomNumber(0,height));

			context.lineTo( randomNumber(0,width), randomNumber(0,height));

			context.stroke();
		}

		//產生干擾點
		for(let i=0 ; i<50 ; i++){
			context.fillStyle = randomColor(0,255);

			context.beginPath();
			
			context.arc( randomNumber(0,width), randomNumber(0,height),1,0,2*Math.PI);

			context.fill();
		}

		//紀錄驗證碼
		this.real_identifyingCode = codeString;
	}

}
