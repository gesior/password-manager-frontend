import {Component, Injectable, Input} from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class ErrorComponent {
  @Input() error = '';

}
