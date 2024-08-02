// user-type.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserTypeService {
  private userTypeSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  userType$: Observable<string> = this.userTypeSubject.asObservable();

  setUserType(userType: string): void {
    this.userTypeSubject.next(userType);
  }
}
