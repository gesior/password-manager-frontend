import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private loading = false;
  setLoading(loading: boolean) {
    this.loading = loading;
  }
  isLoading() {
    return this.loading;
  }
}

