import { Component, OnInit } from '@angular/core';
import { ListService } from '../list.service';
import { StudentList } from './StudentList';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {



  url: string;

  constructor(private listService: ListService) {

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
    location.reload();
  }

}
