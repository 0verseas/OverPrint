

class student_personal_data {
  gender: string;
  resident_id: string;
}

class school{
  title: string;
}

class department_data{
  title: string;
  school: school[];
}

class student_misc_data{
  overseas_student_id: string;
  department_data: department_data[];

}

export class StudentList {
  id: number;
  name: string;
  student_personal_data: student_personal_data[];
  student_misc_data: student_misc_data[];
}
