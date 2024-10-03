
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // live
  // private baseUrl = '//10.100.32.41:8082';

  
  private baseUrl = '//localhost:8082';

  private apiUrl = `${this.baseUrl}/login`;


  constructor(private http: HttpClient, private router: Router) {}

   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin'   :'*',
      
      // 'Authorization'                 : 'Bearer ' //+ this.localSService.getToken()
    }),
    withCredentials : false,
  };

  httpOptions2 = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin'   :'*',
      
      'Authorization'                 : 'Bearer ' + this.getToken()
    }),
    withCredentials : false,
  };

  credentials: {
     username: string;
     password: string 
  }
  


  login(credentials): Observable<any> {
   
    return this.http.post(this.apiUrl, credentials, this.httpOptions).pipe(
      map((response: any) => {
      
        return response;
      })
    );
  }





  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); 
    localStorage.removeItem('name'); 
    localStorage.removeItem('incidentCount'); 
    localStorage.removeItem('level'); 
    localStorage.removeItem('empCode'); 
    this.router.navigate(['/login']);
  }

  
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
   
    return localStorage.getItem('token');
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }


  setBranch(branch: any) {
    localStorage.setItem('branch', branch);
  }

  getBranch() {
    return localStorage.getItem('branch');
  }

  
  setId(userId: string) {
    localStorage.setItem('userId', userId);
  }

  getId() {
    return localStorage.getItem('userId');
  }

    
  setempCode(empCode: string) {
    localStorage.setItem('empCode', empCode);
  }

  getempCode() {
    return localStorage.getItem('empCode');
  }


  setLevel(level:any){
    localStorage.setItem('level', level);
 
  }

  getLevel() {
    return localStorage.getItem('level');
  }

  setName(fullName: any) {
    
      localStorage.setItem('name',fullName);
    }

    getName() {
      return localStorage.getItem('name');
    }


    getIncidentCount(): number {
      const storedIncidentCount = localStorage.getItem('incidentCount');
      return storedIncidentCount ? +storedIncidentCount : 0;  // Convert to number or default to 0
    }
  
    setIncidentCount(count: number) {
      localStorage.setItem('incidentCount', count.toString());
    }


  
}

 

















// function getName() {
//   throw new Error('Function not implemented.');
// }
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, map } from 'rxjs';
// import { Router } from '@angular/router'; 
// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {

//   private apiUrl = 'http://10.101.6.133:8086/login';

//   constructor(private http: HttpClient, private router: Router) {} 

//   login(credentials: { username: string; password: string }): Observable<any> {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//       }),
//     };

//     return this.http.post(this.apiUrl, credentials, httpOptions).pipe(
//       map((response: any) => {
//         if (response.token) {
//           console.log('Received Username:', response.user.fullName);
//           console.log('Received token:', response.token);
//           this.setToken(response.token);
//           this.setName(response);
//         }
//         return response;
//       })
//     );
//   }

//   logout(): void {
    
//     localStorage.removeItem('token');
//     this.router.navigate(['/login']); 
//   }

//   setToken(token: string) {
   
//     localStorage.setItem('token', token);
//   }

//   getToken() {
//     return localStorage.getItem('token');
//   }


//   setName(response: any) {
//     if (response && response.user && response.user.fullName) {
//       const fullName = response.user.fullName;
//       localStorage.setItem('name', fullName);
//     }
//   }

//   getName(){
//     return localStorage.getItem('name');
//   }


  

// }
