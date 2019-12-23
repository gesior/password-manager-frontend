import {Injectable} from '@angular/core';
import {EncryptionKey} from '../models/encryption-key';
import {EncryptionKeyProvider} from '../providers/encryption-key-provider';
import {tap} from 'rxjs/operators';
import {Api} from './api.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncryptionKeyService {

  constructor(private encryptionKeyProvider: EncryptionKeyProvider, private api: Api) {
  }

  getList() {
    return this.encryptionKeyProvider.getEncryptionKeys();
  }

  get(id: number): EncryptionKey {
    for (const encryptionKey of this.encryptionKeyProvider.getEncryptionKeys()) {
      if (encryptionKey.id === id) {
        return encryptionKey;
      }
    }
    return null;
  }

  create(encryptionKey: EncryptionKey) {
    return this.api.createEncryptionKey(encryptionKey).pipe(tap<EncryptionKey>(data => {
      this.encryptionKeyProvider.getEncryptionKeys().push(data);
    }, error => {
    })) as Observable<EncryptionKey>;
  }

  public deleteCustomer(id: number) {
  }
}

