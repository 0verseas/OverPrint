import { Component, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { environment } from 'src/environments/environment.prod';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas : ElementRef;
  
  id:string;
  params: any;

  constructor(  private dialogRef: MatDialogRef<SignComponent>, @Inject(MAT_DIALOG_DATA) data  ) { 
    this.id =data.id;//取得ParentComponent傳遞的參數
  }

  private ctx: CanvasRenderingContext2D;

  ngAfterViewInit() {
    
	const canvasElement: HTMLCanvasElement = this.canvas.nativeElement; // 先取得html中的畫布
	
	/* 進行畫布參數設定 */
    this.ctx = canvasElement.getContext("2d");  
    canvasElement.width = innerWidth * 0.72;
	canvasElement.height = innerHeight * 0.72;
	
	/* 進行繪畫格式設定 */
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';

	/* 進行事件設定 */
    this.captureEvents(canvasElement);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
	/* 滑鼠事件設定 */
    fromEvent(canvasEl, 'mousedown') //滑鼠點擊
      .pipe(
        switchMap((e) => {
          return fromEvent(canvasEl, 'mousemove')//游標移動
            .pipe(
              takeUntil(fromEvent(canvasEl, 'mouseup')),//滑鼠回彈（點擊結束）
              //takeUntil(fromEvent(canvasEl, 'mouseleave')),//游標超出範圍到底要不要停止呢
              pairwise()
            )
        })
      ).subscribe((res: [MouseEvent, MouseEvent]) => {
		/* 取得畫布左上角座標後 運算先前座標比對當前座標進行繪圖 */
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
  
        this.drawOnCanvas(prevPos, currentPos);
	  });

	  /* 觸碰事件設定 */
      fromEvent(canvasEl, 'touchstart')//開始觸碰
      .pipe(
        switchMap((e) => {
          return fromEvent(canvasEl, 'touchmove')//正在滑動
            .pipe(
              takeUntil(fromEvent(canvasEl, 'touchend')),//結束觸碰
              //takeUntil(fromEvent(canvasEl, 'touchcancel')),//滑動時超出範圍到底要不要停止呢
              pairwise()
            )
        })
      ).subscribe((res: [MouseEvent, MouseEvent]) => {
		/* 取得畫布左上角座標後 運算先前座標比對當前座標進行繪圖 */
        const rect = canvasEl.getBoundingClientRect();  
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };
  
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
  
        this.drawOnCanvas(prevPos, currentPos);
      });
  }
  private drawOnCanvas(  prevPos: { x: number, y: number },    currentPos: { x: number, y: number } ) {
	/* 從先前座標 畫一條線到 當前座標 */
    if (!this.ctx) { return; }
  
    this.ctx.beginPath();
  
    if (prevPos) {
      this.ctx.moveTo(prevPos.x, prevPos.y); 
  
      this.ctx.lineTo(currentPos.x, currentPos.y);
  
      this.ctx.stroke();
    }
  }
  
  /*清除 Canvas */
  clearCanvas():void {
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasElement.getContext("2d");
    this.ctx.clearRect(0,0,canvasElement.width, canvasElement.height);    
  }

  /* 傳送DataURL到後端儲存 */
  saveCanvas(): void{
	/* 取得畫布的DataURL */
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasElement.getContext("2d");
    const Image = canvasElement.toDataURL("image/png");

	/* 將DataURL傳送到後端  */
    let url = environment.baseUrl + '/admins/save-signature/' + this.id;//後端連結網址
    fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        DataURL:Image 
      })
	})
	.then((fetchResponse)=>{
		/* 將Response用json()轉化後取需要的值 */
		return fetchResponse.json().then(data => {
		  return {
			ok: fetchResponse.ok,
			data,
		  };
		}).then(res => {
		  // 錯誤時的處理
  
		  // 沒錯就跳過
		  if (res.ok) {
			this.params.testFunction(res.ok);
			this.dialogRef.close();
			return res;
		  }
		  // 有錯就傳遞訊息
		  throw  res;
		});
	  })
	.catch((err) => {
		alert(err.data.messages); //messages是後端設定的參數
		this.params.testFunction(err.ok);
		this.dialogRef.close();
	});
  }
}
