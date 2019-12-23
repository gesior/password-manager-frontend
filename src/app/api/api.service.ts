import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DataRow} from '../models/data-row';
import {AppService} from './app.service';
import {EncryptionKey} from '../models/encryption-key';

import {ConfigService} from '../services/config-service';

@Injectable({
  providedIn: 'root'
})
export class Api {
  private serverUrl = '';

  constructor(private http: HttpClient, private appService: AppService, private configService: ConfigService) {
    this.serverUrl = configService.getServerUrl();
  }

  login(username: string, password: string): Observable<any> {
    console.log('start login');
    return this.http.post(this.serverUrl + '/api/login_check', {
      username,
      password
    }).pipe(tap(data => {
    }, error => {
      this.appService.onApiError(error);
      return error;
    }));
  }

  getDataRows() {
    console.log('api call getDataRows');
    return this.http.get(this.serverUrl + '/api/data')
      .pipe(catchError(error => {
        this.appService.onApiError(error);
        return error;
      })) as Observable<DataRow[]>;
  }

  getPassword(dataRowId: number) {
    console.log('api call getPassword', dataRowId);
    return this.http.get(this.serverUrl + '/api/data/' + dataRowId + '/get-password')
      .pipe(catchError(error => {
        this.appService.onApiError(error);
        return error;
      })) as Observable<string>;
  }

  setPassword(dataRowId: number, password: string, encryptionKeyId) {
    console.log('api call setPassword');
    return this.http.post(this.serverUrl + '/api/data/' + dataRowId + '/set-password', {
      password,
      encryptionKeyId
    })
      .pipe(catchError(error => {
        this.appService.onApiError(error);
        return error;
      })) as Observable<boolean>;
  }

  getRecoveryInfo(dataRowId: number) {
    console.log('api call getRecoveryInfo', dataRowId);
    return this.http.get(this.serverUrl + '/api/data/' + dataRowId + '/get-recovery-info')
      .pipe(catchError(error => {
        this.appService.onApiError(error);
        return error;
      })) as Observable<string>;
  }

  setRecoveryInfo(dataRowId: number, recoveryInfo: string, encryptionKeyId) {
    console.log('api call setRecoveryInfo');
    return this.http.post(this.serverUrl + '/api/data/' + dataRowId + '/set-recovery-info', {
      recoveryInfo,
      encryptionKeyId
    })
      .pipe(catchError(error => {
        this.appService.onApiError(error);
        return error;
      })) as Observable<boolean>;
  }

  createDataRow(dataRow: DataRow) {
    console.log('api call createDataRow');
    return this.http.post(this.serverUrl + '/api/data/create', dataRow)
      .pipe(catchError(error => {
        this.appService.onApiError(error);
        return error;
      })) as Observable<DataRow>;
  }

  updateDataRow(dataRow: DataRow) {
    console.log('api call updateDataRow');
    return this.http.post(this.serverUrl + '/api/data/' + dataRow.id + '/update', dataRow)
      .pipe(catchError(error => {
        this.appService.onApiError(error);
        return error;
      })) as Observable<boolean>;
  }

  createEncryptionKey(encryptionKey: EncryptionKey) {
    console.log('api call createEncryptionKey');
    return this.http.post(this.serverUrl + '/api/encryption-key/create', encryptionKey)
      .pipe(catchError(error => {
        this.appService.onApiError(error);
        return error;
      })) as Observable<EncryptionKey>;
  }

  getEncryptionKeys() {
    console.log('api call getEncryptionKeys', this.appService);
    return this.http.get(this.serverUrl + '/api/encryption-key/list');
  }

}
