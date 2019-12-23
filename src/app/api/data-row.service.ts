import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DataRow} from '../models/data-row';
import {Api} from './api.service';
import {catchError, map, tap} from 'rxjs/operators';
import {EncryptionKey} from '../models/encryption-key';
import {EncryptionService} from './encryption.service';
import {EncryptionKeyService} from "./encryption-key.service";

@Injectable({
  providedIn: 'root'
})
export class DataRowService {
  dataRows: Observable<DataRow[]> = null;

  constructor(private api: Api, private encryptionService: EncryptionService, private encryptionKeyService: EncryptionKeyService) {
  }

  getList(forceReload: boolean = false) {
    if (this.dataRows === null || forceReload) {
      this.dataRows = this.api.getDataRows()
        .pipe(map<DataRow[], DataRow[]>((dataRows: DataRow[], index) => {
            const ret = [];
            for (const dataRow of dataRows) {
              ret.push(dataRow);
            }
            return ret;
          })
        );
    }

    return this.dataRows;
  }

  get(id: number, forceReload: boolean = false): Observable<DataRow> {
    if (this.dataRows === null || forceReload) {
      this.dataRows = this.getList();
    }

    return this.dataRows.pipe(map<DataRow[], DataRow>((dataRows: DataRow[], index: number) => {
      for (const dataRow of dataRows) {
        if (dataRow.id === id) {
          return dataRow;
        }
      }
      return null;
    }));
  }

  getPassword(dataRow: DataRow) {
    return this.api.getPassword(dataRow.id).pipe(map<string, Promise<string>>((encryptedPassword: string, index: number) => {
      const encryptionKey = this.encryptionKeyService.get(dataRow.passwordEncryptionKeyId);
      return this.encryptionService.decrypt(encryptionKey, encryptedPassword);
    }));
  }

  async setPassword(dataRow: DataRow, password: string, encryptionKey: EncryptionKey) {
    const encryptedPassword = await this.encryptionService.encrypt(encryptionKey, password);
    return this.api.setPassword(dataRow.id, encryptedPassword, encryptionKey.id);
  }

  getRecoveryInfo(dataRow: DataRow) {
    return this.api.getRecoveryInfo(dataRow.id).pipe(map<string, Promise<string>>((encryptedRecoveryInfo: string, index: number) => {
      const encryptionKey = this.encryptionKeyService.get(dataRow.recoveryInfoEncryptionKeyId);
      return this.encryptionService.decrypt(encryptionKey, encryptedRecoveryInfo);
    }));
  }

  async setRecoveryInfo(dataRow: DataRow, recoveryInfo: string, encryptionKey: EncryptionKey) {
    const encryptedRecoveryInfo = await this.encryptionService.encrypt(encryptionKey, recoveryInfo);
    return this.api.setRecoveryInfo(dataRow.id, encryptedRecoveryInfo, encryptionKey.id);
  }

  public create(dataRow: DataRow) {
    return this.api.createDataRow(dataRow).pipe(tap<DataRow>(data => {
      if (this.dataRows !== null) {
        this.dataRows = null;
      }
    }));
  }

  public update(dataRow: DataRow) {
    return this.api.updateDataRow(dataRow);
  }

}

