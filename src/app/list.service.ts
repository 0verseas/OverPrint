import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StudentList } from './list/StudentList';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private heroesUrl = environment.baseUrl + '/admins/download-distribution-list';  // URL to web api

  constructor(
    private http: HttpClient,
    private listService: ListService
  ) { }

  /** GET list from the server */
  public getList(): Observable<StudentList[]> {
    return this.http.get<StudentList[]>(this.heroesUrl);
  }




}
