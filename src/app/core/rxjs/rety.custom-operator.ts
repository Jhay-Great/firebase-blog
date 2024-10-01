import { catchError, Observable, pipe, retry, throwError } from 'rxjs';

// export const retryErorr = () => {
//   pipe(
//     retry(3),
//     catchError((error) => {
//       console.log(error);
//       return throwError(() => error.message);
//     })
//   );
// };

export const retryError = (retryCount:number = 3) => {
    return <T>(source$:Observable<T>) => {
        return source$.pipe(
            retry(retryCount),
            catchError((error) => {
                console.log(error);
                return throwError(() => error.message || 'An error occurred')
            })
        )
    }
}

// export const retryError = (retryCount: number = 3) => {
//     return <T>(source: Observable<T>) =>
//       source.pipe(
//         retry(retryCount),
//         catchError((error) => {
//           console.error('Error occurred:', error);
//           return throwError(() => new Error(error.message || 'An error occurred'));
//         })
//       );
//   };
