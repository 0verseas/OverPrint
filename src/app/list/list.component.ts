import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { SignComponent } from '../sign/sign.component';
import { StudentList } from './StudentList';
import { environment } from 'src/environments/environment.prod';
import printJS from '../../../node_modules/print-js/dist/print.js';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material";


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  url: string;
  searchkeyword: string = '';

  Name = '';
  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.route.params.subscribe(res => {
      this.Name = res.name;
    });
  }

  studentList: StudentList[];

  ngOnInit() {
    this.getList();
  }

  // getList(): void {
  //   this.studentList = this.listService.getList();
  // }

  getList(): void {
    this.listService.getList().subscribe(studentList => this.studentList = studentList);
  }

  print(id: string): void {

    this.url = environment.baseUrl + '/admins/download-distribution-list/' + id;

    printJS({
      printable: this.url,
      type: 'pdf',
      showModal: true,
      modalMessage: 'Generating File...',
      onPrintDialogClose: () => this.reload() });
  }

  reload(): void {
    //location.reload(); // 不知為何會被導到login頁面
    //window.location.reload(); // 不知為何會被導到login頁面
    //this.router.navigate(['list']);
    this.ngOnInit();
    }
  //打開簽名視窗

  Open(id: string): void {
    const dialogConfig = new MatDialogConfig();
    //dialogConfig.disableClose = true; //開啟後不觸發dialog.close不能關閉dialog
    dialogConfig.autoFocus = true; //自動focus在第一個控制項
    dialogConfig.data = {'id': id}; //傳遞user_id到dialog Component
    dialogConfig.width = (window.innerWidth*0.8).toString()+'px'; 
    dialogConfig.height = (window.innerHeight*0.8).toString()+'px';
    let ref =this.dialog.open(SignComponent, dialogConfig); // ref參數會取得Boolean回傳值  確認簽名檔案儲存是否成功
    ref.componentInstance.params = {
      title:'DataURL',
      testFunction:(fromDialog)=>{
        /* 簽名檔成功儲存就列印 失敗就跳alert */
        if(fromDialog){
          this.print(id);
        } else {
          alert("簽收失敗請重來一次！");
        }
        return fromDialog;
      }
    }
  }
}
