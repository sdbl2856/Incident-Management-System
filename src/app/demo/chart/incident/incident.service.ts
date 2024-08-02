import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';

@Injectable({
  providedIn: 'root'
})

export class IncidentService {
  userId: any;
  

 

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userId = this.authService.getId();
  }

  private baseUrl: string = this.authService.getBaseUrl();

  postIncidents(userId: number, data: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/incident/create/${userId}`;
    return this.http.post<any>(apiUrl, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getRiskCauses(): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/incident/all`;
    return this.http.get<any[]>(apiUrl,this.authService.httpOptions2).pipe(
      tap((data) => {
        // console.log('riskcauses:', data);
      })
    );
  }

  
}
