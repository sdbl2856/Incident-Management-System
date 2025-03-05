import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';
import { throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class IncidentService {
  userId: any;
  

 

  constructor(private http: HttpClient, private authService: AuthService) {
    this.userId = this.authService.getId();
  }

  httpOptions2 = {
    headers: new HttpHeaders({
        // 'Accept': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin'   : '*',
        'Authorization'                 : 'Bearer '
    })
};
  private baseUrl: string = this.authService.getBaseUrl();

  // postIncidents(userId: number, data: any): Observable<any> {

  //   const apiUrl = `${this.baseUrl}/incident/create/${userId}`;

  //   return this.http.post<any>(apiUrl, data).pipe(
  //     map((res: any) => {
  //       return res;
  //     })
  //   );

  // }

  
  postIncidents(userId: number, formData: any){
    return this.http.post(`${this.baseUrl}/incident/create/${userId}`,formData, this.authService.httpOptions2).pipe(
        catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        console.error('An error occurred:', error.error.message);
    } else {
        console.error('Backend returned code error'+ error);
    }
    return throwError('Something bad happened; please try again later.');
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
