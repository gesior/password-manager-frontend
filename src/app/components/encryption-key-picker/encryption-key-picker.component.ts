import {Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import {EncryptionKeyService} from '../../api/encryption-key.service';
import {EncryptionKey} from '../../models/encryption-key';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EncryptionService} from '../../api/encryption.service';

@Component({
  selector: 'app-encryption-key-picker',
  templateUrl: './encryption-key-picker.component.html',
  styleUrls: ['./encryption-key-picker.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class EncryptionKeyPickerComponent implements OnInit {
  @Input() encryptionKey: EncryptionKey;
  @Output() encryptionKeyChanged = new EventEmitter<EncryptionKey>();
  encryptionKeyForm: FormGroup;

  constructor(private fb: FormBuilder, private encryptionKeyService: EncryptionKeyService, private encryptionService: EncryptionService) {
  }

  ngOnInit() {
    let encryptionKeyControlValue;
    if (this.encryptionKey) {
      encryptionKeyControlValue = [this.encryptionKey.id];
    }
    this.encryptionKeyForm = this.fb.group({
      encryptionKeyControl: encryptionKeyControlValue
    });
  }

  isLoaded(encryptionKey: EncryptionKey) {
    return this.encryptionService.isEncryptionKeyLoaded(encryptionKey);
  }

  onChange(newEncryptionKeyId: string) {
    const pickedEncryptionKey = this.encryptionKeyService.get(parseInt(newEncryptionKeyId, 10));
    this.encryptionKeyChanged.emit(pickedEncryptionKey);
  }
}
