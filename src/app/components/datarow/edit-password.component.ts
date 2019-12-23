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
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit {
  dataRow: DataRow;
  private encryptionKey = null;
  private password = '';
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
          this.password = await passwordDecoder;
        });
      }
    });
  }

  onPasswordFieldFocus(event) {
    event.target.setAttribute('type', 'text');
  }

  onPasswordFieldFocusOut(event) {
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
      (await this.dataRowService.setPassword(this.dataRow, this.password, this.encryptionKey))
        .subscribe((data) => {
          console.log('updated', data);
          this.router.navigate(['/password/details', this.dataRow.id]);
        });
    } catch (e) {
      this.error = e.message;
    }
  }
}
