import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {


  constructor(private http: HttpClient,private authService:AuthService) {}

  private baseUrl = this.authService.getBaseUrl();
  private apiUrl = `${this.baseUrl}/user/all`;
  

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data) => {
        // console.log('Data from the API:', data['userList']);
      })
    );
  }

  getBranches(): Observable<any[]> {
    const branchesUrl = `${this.baseUrl}/user/branches`;
    return this.http.get<any[]>(branchesUrl).pipe(
      tap((data) => {
        // console.log('Branches:', data);
      })
    );
  }

  postUser(data: any): Observable<any> {
    const createUserUrl = `${this.baseUrl}/user/create`;
    return this.http.post<any>(createUserUrl, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateUser(data: any): Observable<any> {
    const updateUserUrl = `${this.baseUrl}/user/create`; // Adjust the URL accordingly
    return this.http.post<any>(updateUserUrl, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
