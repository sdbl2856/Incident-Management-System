import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewUserService {

  // private Url='http://localhost:3000/posts';

  // constructor(private http:HttpClient) { }

  
  // getPosts(): Observable<any[]> {
  //   return this.http.get<any[]>(this.Url);
  // }

  // deleteUsers(id:number){
  //   return this.http.delete<any>("http://localhost:3000/posts/"+id)
  //   .pipe(map((res:any)=>{
  //     return res;
  //   }))

  // }

  // postUser(data : any){
  //   return this.http.post<any>("http://localhost:3000/posts", data)
  //   .pipe(map((res:any)=>{
  //     return res;
  //   }))

  // }

  // updateUser(data : any,id:number){
  //   return this.http.put<any>("http://localhost:3000/posts/"+id, data)
  //   .pipe(map((res:any)=>{
  //     return res;
  //   }))

  // }

  // uploadImage1(file: File): Observable<any> {
  //   const formData = new FormData();
  //   formData.append('image1', file);
  //   return this.http.post("http://localhost:3000/posts/",formData);
  // }



}
