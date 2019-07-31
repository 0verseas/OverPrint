import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { StudentList } from './StudentList';
import { environment } from 'src/environments/environment.prod';
import printJS from '../../../node_modules/print-js/dist/print.js';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {



  url: string;
  searchkeyword: string = '';

  Name = '';
  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(res => {
      this.Name = res.name;
      console.log(res.name);
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
    this.listService.getList()
    .subscribe(studentList => this.studentList = studentList);
  }

  print(id: string): void {

    this.url = environment.baseUrl + '/admins/download-distribution-list/' + id;
    console.log(this.url);

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

}
