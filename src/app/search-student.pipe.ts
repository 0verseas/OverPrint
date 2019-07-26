import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class SearchStudentPipe implements PipeTransform {

  // transform(value: any, args?: any): any {
  //   return null;
  // }

  transform(items: any[], field: string, value: string): any[] {
    if (!items) {
      return [];
    }
    if (!field || !value) {
      return items;
    }

    // 搜尋單一欄位
    // return items.filter(singleItem =>
    //   singleItem[field].toString().toLowerCase().includes(value.toString().toLowerCase())
    // );

    return items.filter(singleItem =>{
      const name = singleItem.name.toString().includes(value)
      const resident_id = singleItem.student_personal_data.resident_id.toString().includes(value) 
      return (name + resident_id);
    });


  }

}
