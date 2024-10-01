import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private userSubject = new BehaviorSubject<any>([])
  private user$ = this.userSubject.asObservable();

  constructor() { }

  setUser (data:any) {
    this.userSubject.next(data);
  }

  getUser () {
    return this.user$;
  }
}
