import { Component, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements AfterViewInit {

  @ViewChild('canvas', { static: true }) public canvas : ElementRef;
  
  data:object;
  id:string;
  url:string;
  params: any;
  isSign:boolean = false;

  constructor(  private dialogRef: MatDialogRef<ShowComponent>, @Inject(MAT_DIALOG_DATA) data, @Inject(MAT_DIALOG_DATA) url) { 
    this.data =data.data;//取得ParentComponent傳遞的參數
    this.id = this.data['id'];
    this.url = url.url;
  }
  
  ngAfterViewInit() {
    
	  const canvasElement: HTMLCanvasElement = this.canvas.nativeElement; // 先取得html中的畫布
	
	  /* 進行畫布參數設定 */
    let ctx = canvasElement.getContext("2d");  
    canvasElement.width = innerWidth * 0.72;
    canvasElement.height = innerHeight * 0.6;
    let img = new Image();
    img.addEventListener("load", function() {
      // 在影像載入完成前呼叫drawImage()不會有任何效果，甚至某些瀏覽器還會拋出例外狀況，所以應該要利用載入事件來避免這類問題
      ctx.drawImage(img,0,0,innerWidth*0.72,innerHeight*0.6);
    }, false);
    img.src = this.url;
  }
}