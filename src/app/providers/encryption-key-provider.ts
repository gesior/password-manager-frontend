import {Injectable} from '@angular/core';
import {EncryptionKey} from '../models/encryption-key';
import {Api} from '../api/api.service';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EncryptionKeyProvider {
  private encryptionKeys: EncryptionKey[] = null;

  constructor(private api: Api) {
  }

  public getEncryptionKeys(): EncryptionKey[] {
    return this.encryptionKeys;
  }

  load() {
    return new Promise((resolve, reject) => {
      this.api.getEncryptionKeys()
        .pipe(catchError(error => {
          resolve(true);
          return error;
        })).subscribe(encryptionKeys => {
        this.encryptionKeys = encryptionKeys as EncryptionKey[];
        resolve(true);
      });
    });
  }
}
