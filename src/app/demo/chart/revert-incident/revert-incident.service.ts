import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RevertIncidentService {
  userId: any;
  

  constructor(private http: HttpClient, private authService: AuthService) { 
    this.userId = this.authService.getId();
  }

  private baseUrl: string = this.authService.getBaseUrl();

  getPosts(userId: number): Observable<any> {
    const apiUrl = `${this.baseUrl}/incident/level/${userId}`;
    return this.http.get<any>(apiUrl).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  updateIncidents(data: any): Observable<any> {
    if (!data) {
      // Handle the case where data is null
      console.log('data is null');
    }
    const apiUrl = `${this.baseUrl}/incident/update/`;
    return this.http.post<any>(apiUrl, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  revertDetails(data: any): Observable<any> {
    if (!data) {
      // Handle the case where data is null
      console.log('data is null');
    }
    const apiUrl = `${this.baseUrl}/incident/revert/`;
    return this.http.post<any>(apiUrl, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  
}
