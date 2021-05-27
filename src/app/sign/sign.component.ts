import { Component, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { switchMap, takeUntil, pairwise, tap, map, concatMap } from 'rxjs/operators';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import { environment } from 'src/environments/environment.prod';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements AfterViewInit {

  @ViewChild('canvas', { static: true }) public canvas : ElementRef;
  
  data:object;
  id:string;
  params: any;
  isSign:boolean = false;

  constructor(  private dialogRef: MatDialogRef<SignComponent>, @Inject(MAT_DIALOG_DATA) data  ) { 
    this.data =data.data;//取得ParentComponent傳遞的參數
    this.id = this.data['id'];
  }
  
  ngAfterViewInit() {
    
	  const canvasElement: HTMLCanvasElement = this.canvas.nativeElement; // 先取得html中的畫布
	
	  /* 進行畫布參數設定 */
    let ctx = canvasElement.getContext("2d");  
    canvasElement.width = innerWidth * 0.72;
	  canvasElement.height = innerHeight * 0.6;
	
	  /* 進行繪畫格式設定 */
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

	  /* 進行事件設定 */
    this.captureEvents(canvasElement);
  }

  captureEvents(canvasEl: HTMLCanvasElement) {
    /* 取得畫布資訊 */
    let rect = canvasEl.getBoundingClientRect();
    let ctx = canvasEl.getContext('2d');

    ctx.beginPath(); //開始繪畫
    var draw = function(to: any) {
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    };

    /* 滑鼠事件發生時判斷位置 */
    const mouseEventToCoordinate = (mouseEvent: any) => {
      mouseEvent.preventDefault();
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
      };
    };
    
    /* 滑鼠事件 點擊  移動  放開 */
    const mouseDowns = fromEvent(canvasEl, 'mousedown').pipe(
      map(mouseEventToCoordinate)
    );
    const mouseMoves = fromEvent(canvasEl, 'mousemove').pipe(
      map(mouseEventToCoordinate)
    );
    const mouseUps = fromEvent(window, 'mouseup').pipe(
      map(e => {
        return mouseEventToCoordinate(e);
      })
    );

    /* 觸碰事件發生時判斷位置 */
    const touchEventToCoordinate = (touchEvent: any) => {
      touchEvent.preventDefault();
      return {
        x: touchEvent.changedTouches[0].clientX - rect.left,
        y: touchEvent.changedTouches[0].clientY - rect.top
      };
    };

    /* 觸碰事件 點擊  移動  放開 */
    const touchStarts = fromEvent(canvasEl, 'touchstart').pipe(
      map(touchEventToCoordinate)
    );
    const touchMoves = fromEvent(canvasEl, 'touchmove').pipe(
      map(touchEventToCoordinate)
    );
    
    const touchEnds = fromEvent(canvasEl, 'touchend').pipe(
      map(e => {
        return touchEventToCoordinate(e);
      })
    );

    /* 合併mouse & touch function*/
    const starts = merge(mouseDowns, touchStarts);
    const moves = merge(mouseMoves, touchMoves);
    const ends = merge(mouseUps, touchEnds);

    /* 繪畫線段處理 */
    const draws = starts.pipe(
      tap(p => {
        ctx.moveTo(p.x, p.y);
      }),
      concatMap(p => moves.pipe(takeUntil(ends)))
    );

    draws.subscribe(p => {
      draw(p);
      this.isSign = true;
    });
  }

  /*清除 Canvas */
  clearCanvas():void {
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    let ctx = canvasElement.getContext("2d");
    ctx.clearRect(0,0,canvasElement.width, canvasElement.height);
    ctx.beginPath(); //開始繪畫
    this.isSign = false ;
  }

  /* 傳送DataURL到後端儲存 */
  saveCanvas(): void{
    if(this.isSign){
      /* 取得畫布的DataURL */
      const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
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
        })
        .then(res => {
            // 錯誤時的處理

            // 沒錯就跳過
            if (res.ok) {
              this.params.afterSign(res.ok);
              this.dialogRef.close();
              return res;
            }
            // 有錯就傳遞訊息
            throw  res;
        });
      })
      .catch((err) => {
        alert(err.data.messages); //messages是後端設定的參數
        this.dialogRef.close();
      });
    } else {
      alert('請確實簽名！');
    }
  }
}
