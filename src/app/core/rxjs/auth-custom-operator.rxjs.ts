import { GoogleAuthProvider } from "@angular/fire/auth";
import { Observable, map, catchError, of, retry } from "rxjs";

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

    // handle provider/google response
    export const handleProviderResponse = (response: Observable<any>) => {
        return response.pipe(map (response => {
          const client = GoogleAuthProvider.credentialFromResult(response);
          const token = client?.accessToken;
          return { client, token };
        }),
        retry(2),
        catchError(err => {
          const errorCode = err.code;
          const message = err.message;
          const clientError = GoogleAuthProvider.credentialFromError(err);
          console.log({clientError, message, errorCode})
          return message;
        })
      )
      }