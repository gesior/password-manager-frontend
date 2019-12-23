import {Component, OnInit} from '@angular/core';
import {EncryptionKeyService} from '../api/encryption-key.service';
import {EncryptionService} from '../api/encryption.service';
import {EncryptionKey} from '../models/encryption-key';

@Component({
  selector: 'app-key-list',
  templateUrl: './key-list.component.html',
  styleUrls: ['./key-list.component.scss']
})
export class KeyListComponent implements OnInit {
  encryptionKeys: EncryptionKey[];
  constructor(private  encryptionKeyService: EncryptionKeyService, private encryptionService: EncryptionService) {
  }

  ngOnInit() {
    this.encryptionKeys = this.encryptionKeyService.getList();
  }

}
