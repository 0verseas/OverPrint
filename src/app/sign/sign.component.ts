import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements AfterViewInit {

  @ViewChild('canvas') public canvas : ElementRef;
  
  constructor() { }

  private ctx: CanvasRenderingContext2D;

  ngAfterViewInit() {
    
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;

    this.ctx = canvasElement.getContext("2d");
    canvasElement.width = innerWidth * 0.785;
    canvasElement.height = innerHeight * 0.72;

    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000';

    this.captureEvents(canvasElement);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              //takeUntil(fromEvent(canvasEl, 'mouseleave')),//超出範圍到底要不要停止呢
              pairwise()
            )
        })
      ).subscribe((res: [MouseEvent, MouseEvent]) => {
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
      fromEvent(canvasEl, 'touchstart')
      .pipe(
        switchMap((e) => {
          return fromEvent(canvasEl, 'touchmove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'touchend')),
              //takeUntil(fromEvent(canvasEl, 'touchcancel')),//超出範圍到底要不要停止呢
              pairwise()
            )
        })
      ).subscribe((res: [MouseEvent, MouseEvent]) => {
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
    if (!this.ctx) { return; }
  
    this.ctx.beginPath();
  
    if (prevPos) {
      this.ctx.moveTo(prevPos.x, prevPos.y); 
  
      this.ctx.lineTo(currentPos.x, currentPos.y);
  
      this.ctx.stroke();
    }
  }
  
  clearCanvas():void {
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    this.ctx = canvasElement.getContext("2d");
    this.ctx.clearRect(0,0,canvasElement.width, canvasElement.height);    
  }

}
