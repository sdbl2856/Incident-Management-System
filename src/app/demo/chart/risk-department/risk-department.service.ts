import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RiskDepartmentService {
  userId: any;
  incidentId: any;
 

  constructor(private http: HttpClient, private authService: AuthService) { 
    this.userId = this.authService.getId();
  }
  
  private baseUrl: string =  this.authService.getBaseUrl();
 
  getPosts(userId: number, selectedStatus: string | undefined = undefined): Observable<any> {
    let apiUrl = `${this.baseUrl}/incident/level/${userId}`;
  
    // If selectedStatus is provided, append it to the URL
    if (selectedStatus !== undefined) {
      apiUrl += `?status=${selectedStatus}`;
    }
    return this.http.get<any>(apiUrl).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getTypes(): Observable<any[]> {
    const apiUrl = `${this.baseUrl}/incident/types`;
    return this.http.get<any[]>(apiUrl).pipe(
      tap((data) => {
        // console.log('types:', data);
      })
    );
  }
  
  // sendBackIncident(incidentId: number, data: any): Observable<any> {
  //   const apiUrl = `${this.baseUrl}/incident/sendback/${incidentId}`;
  //   return this.http.post<any>(apiUrl, data).pipe(
  //     map((res: any) => {
  //       return res;
  //     })
  //   );
  // }

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


  updateIncidents(incidentId: any, data: any): Observable<any> {
    if (!data) {
      // Handle the case where data is null
      console.log('data is null');
    }
    const apiUrl = `${this.baseUrl}/incident/risk/update/${incidentId}`;
    return this.http.post<any>(apiUrl, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }



  updateStatus(incidentId: any, data: any): Observable<any> {
    if (!data) {
      // Handle the case where data is null
      console.log('data is null');
    }
    const apiUrl = `${this.baseUrl}/incident/risk/status/${incidentId}`;
    return this.http.post<any>(apiUrl, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }


  // ...........................
  sendBackIncident(incidentId: number, data: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/incident/sendback/${incidentId}`;
    return this.http.post<any>(apiUrl, data)
      .pipe(map((res: any) => {
        return res;
      }));
  }
  forwardIncident(incidentId: number, data: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/incident/forward/${incidentId}`;
    return this.http.post<any>(apiUrl, data)
      .pipe(map((res: any) => {
        return res;
      }));
  }

}
