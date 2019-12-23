import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private token = '';

  constructor(private router: Router) {

  }

  onLogin(token: string) {
    console.log('onLogin', token);
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  onLogout() {
    this.token = '';
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  onApiError(error) {
    console.log('api error', error);
    if (error && error.status && error.status === 401) {
      this.onLogout();
    }
  }

}

