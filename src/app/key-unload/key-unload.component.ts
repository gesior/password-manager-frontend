import { Component, OnInit } from '@angular/core';
import {EncryptionKey} from "../models/encryption-key";
import {EncryptionKeyService} from "../api/encryption-key.service";
import {EncryptionService} from "../api/encryption.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-key-unload',
  templateUrl: './key-unload.component.html',
  styleUrls: ['./key-unload.component.scss']
})
export class KeyUnloadComponent implements OnInit {
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

  unload() {
      this.encryptionService.unloadEncryptionKey(this.encryptionKey);
      this.router.navigate(['/key/list']);
  }
}
