import {Injectable} from '@angular/core';
import {config} from '../config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor() {

  }

  getServerUrl() {
    return config.serverUrl;
  }

  getJwtWhitelist() {
    return config.jwtWhitelist;
  }
}
