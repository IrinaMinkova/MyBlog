import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, pipe, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {

    public errors$: Subject<string> = new Subject<string>(); // $ means stream

    constructor(private http: HttpClient) {}

    get token(): string {
        const expDate = new Date (localStorage.getItem('fb-token-exp')); // clean the date when logout and logout after time is expired
        if (new Date() > expDate ) {
            this.logout();
            return null;
        }
        return localStorage.getItem('fb-token');
    }

    login(user: User): Observable<any> {
        user.returnSecureToken = true;
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
        .pipe(
            tap(this.setToken),
            catchError(this.handleError.bind(this))
        );
    }

    logout() {
    this.setToken(null);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    private handleError(error: HttpErrorResponse) {
    const{message} = error.error.error;

    switch (message) {
        case 'INVALID_EMAIL':
            this.errors$.next('Invalid email')
            break;
        case 'INVALID_PASSWORD':
            this.errors$.next('Invalid password')
            break;
        case 'EMAIL_NOT_FOUND':
            this.errors$.next('Email not found')
            break;
    }
    return throwError(error);
}

    private setToken(response: FbAuthResponse) {
        if (response) {
            const expDate = new Date (new Date().getTime() + +response.expiresIn * 1000);
            localStorage.setItem('fb-token', response.idToken);
            localStorage.setItem('fb-token-exp', expDate.toString());
        } else {
            localStorage.clear();
        }

    }
}

