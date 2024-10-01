import { Observable, map, catchError, of } from "rxjs";

  // custom rxjs operator // remove from here later
  export const handleResponse = (response:Observable<any>) => {
    return response.pipe(
      map(data => {
        console.log('on success: ', data);
        return data;
      }),
      catchError(err => {
        console.log('on error: ', err.message);
        return of('login failed');
      })
    )
  }