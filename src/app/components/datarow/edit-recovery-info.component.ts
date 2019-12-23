import {Component, Injectable, OnInit} from '@angular/core';
import {DataRowService} from '../../api/data-row.service';
import {DataRow} from '../../models/data-row';
import {ActivatedRoute, Router} from '@angular/router';
import {EncryptionKeyService} from '../../api/encryption-key.service';
import {EncryptionKey} from '../../models/encryption-key';
import {EncryptionService} from '../../api/encryption.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-edit-recovery-info',
  templateUrl: './edit-recovery-info.component.html',
  styleUrls: ['./edit-recovery-info.component.scss']
})
export class EditRecoveryInfoComponent implements OnInit {
  dataRow: DataRow;
  private encryptionKey = null;
  private recoveryInfo = '';
  private error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataRowService: DataRowService,
    private encryptionService: EncryptionService,
    private encryptionKeyService: EncryptionKeyService
  ) {
  }

  ngOnInit() {
    const dataRowId = parseInt(this.route.snapshot.paramMap.get('id'), 10);

    this.dataRowService.get(dataRowId).subscribe(async dataRow => {
      this.dataRow = dataRow;
      if (this.dataRow.passwordEncryptionKeyId) {
        this.encryptionKey = this.encryptionKeyService.get(this.dataRow.passwordEncryptionKeyId);
        this.dataRowService.getPassword(dataRow).subscribe(async passwordDecoder => {
          this.recoveryInfo = await passwordDecoder;
        });
      }
    });
  }

  onRecoveryInfoFieldFocus(event) {
    event.target.setAttribute('type', 'text');
  }

  onRecoveryInfoFieldFocusOut(event) {
    event.target.setAttribute('type', 'password');
  }

  onEncryptionKeyChange(pickedEncryptionKey: EncryptionKey) {
    console.log('new received', pickedEncryptionKey);
    this.encryptionKey = pickedEncryptionKey;
  }

  isLoaded(encryptionKey: EncryptionKey) {
    return this.encryptionService.isEncryptionKeyLoaded(encryptionKey);
  }

  async onSubmit() {
    if (!this.encryptionKey) {
      this.error = 'Select encryption key!';
      return;
    }
    try {
      (await this.dataRowService.setPassword(this.dataRow, this.recoveryInfo, this.encryptionKey))
        .subscribe((data) => {
          console.log('updated', data);
          this.router.navigate(['/password/details', this.dataRow.id]);
        });
    } catch (e) {
      this.error = e.message;
    }
  }
}
