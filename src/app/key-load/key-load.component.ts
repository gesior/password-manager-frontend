import {Component, OnInit} from '@angular/core';
import {EncryptionKeyService} from "../api/encryption-key.service";
import {EncryptionService} from "../api/encryption.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EncryptionKey} from "../models/encryption-key";

@Component({
  selector: 'app-key-load',
  templateUrl: './key-load.component.html',
  styleUrls: ['./key-load.component.scss']
})
export class KeyLoadComponent implements OnInit {
  password = '';
  error = '';
  encryptionKeyId: number;
  encryptionKey: EncryptionKey;


  constructor(private encryptionKeyService: EncryptionKeyService,
              private encryptionService: EncryptionService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.encryptionKeyId = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.encryptionKey = this.encryptionKeyService.get(this.encryptionKeyId);
  }

  async load() {
    console.log('load key pass', this.password);
    try {
      await this.encryptionService.loadEncryptionKey(this.encryptionKey, this.password);
      this.router.navigate(['/key/list']);
    } catch (e) {
      this.error = e.message;
    }
  }
}
