import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {DataRowService} from '../../api/data-row.service';
import {DataRow} from '../../models/data-row';
import {EncryptionKeyService} from '../../api/encryption-key.service';
import {EncryptionKey} from '../../models/encryption-key';
import {EncryptionService} from "../../api/encryption.service";
import {BbCodeService} from "../../services/bb-code.service";

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  private static PASSWORD_VISIBILITY_TIME = 5000;
  searchText = '';
  updateInterval;
  dataRows: DataRow[] = [];
  encryptionKeys: EncryptionKey[] = [];
  visibleRowsCount = 0;
  rowVisibility = {};
  visiblePasswords = {};

  private static searchInDataRow(dataRow: DataRow, text: string) {
    const words = text.split(' ');
    let wordsFound = 0;
    for (const word of words) {
      if (dataRow.name.indexOf(word) !== -1 || dataRow.login.indexOf(word) !== -1 || dataRow.comment.indexOf(word) !== -1) {
        wordsFound++;
      }
    }
    return words.length === wordsFound;
  }

  constructor(private dataRowService: DataRowService,
              private encryptionKeyService: EncryptionKeyService,
              private encryptionService: EncryptionService,
              private bbCodeService: BbCodeService
  ) {
  }

  ngOnInit() {
    this.updateInterval = setInterval(() => {
      this.updatePasswordVisibility();
    }, 500);

    this.dataRowService.getList().subscribe(data => {
        this.dataRows = data;
        this.updateSearch();
      }
    );
    this.encryptionKeys = this.encryptionKeyService.getList();
  }

  ngOnDestroy() {
    clearInterval(this.updateInterval);
  }

  bbCodeParsed(value: string) {
    return this.bbCodeService.bbcodeToHtml(value);
  }

  updatePasswordVisibility() {
    for (const visiblePasswordKey in this.visiblePasswords) {
      if (this.visiblePasswords.hasOwnProperty(visiblePasswordKey)) {
        const visiblePassword = this.visiblePasswords[visiblePasswordKey];
        if (visiblePassword.startTime && visiblePassword.startTime + ListComponent.PASSWORD_VISIBILITY_TIME < +new Date()) {
          delete this.visiblePasswords[visiblePasswordKey];
        }
      }
    }
  }

  updateSearch() {
    if (this.searchText === '') {
      this.clearSearch();
    } else {
      let visibleRowsCount = 0;
      for (const dataRow of this.dataRows) {
        this.rowVisibility[dataRow.id] = ListComponent.searchInDataRow(dataRow, this.searchText);
        if (this.rowVisibility[dataRow.id]) {
          visibleRowsCount++;
        }
      }
      this.visibleRowsCount = visibleRowsCount;
    }
  }

  private clearSearch() {
    for (const dataRow of this.dataRows) {
      if (dataRow) {
        this.rowVisibility[dataRow.id] = true;
      }
    }
    this.visibleRowsCount = this.dataRows.length;
  }

  isRowVisible(dataRow: DataRow) {
    return this.rowVisibility[dataRow.id];
  }

  isPasswordVisible(dataRow: DataRow) {
    return this.visiblePasswords[dataRow.id];
  }

  getPassword(dataRow: DataRow) {
    return this.visiblePasswords[dataRow.id].password;
  }

  async showPassword(dataRow: DataRow) {
    if (this.isPasswordVisible(dataRow)) {
      this.visiblePasswords[dataRow.id].startTime = +new Date();
    } else {
      this.visiblePasswords[dataRow.id] = {startTime: null, password: 'Loading...'};
      const visiblePasswordData = this.visiblePasswords[dataRow.id];
      this.dataRowService.getPassword(dataRow).subscribe(async passwordDecoder => {
        visiblePasswordData.password = await passwordDecoder;
        visiblePasswordData.startTime = +new Date();
      });
    }
  }
}
