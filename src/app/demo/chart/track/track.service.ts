import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  userId: any;
  
  constructor(private http: HttpClient, private authService: AuthService) { 
    this.userId = this.authService.getId();
  }

  private baseUrl: string = this.authService.getBaseUrl();
 
  getPosts(data: any): Observable<any> {
    const apiUrl = `${this.baseUrl}/incident/search/`;
    return this.http.post<any>(apiUrl, data);
  }


}
