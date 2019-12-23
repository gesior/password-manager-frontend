import {Component, OnInit} from '@angular/core';
import {EncryptionKeyService} from '../api/encryption-key.service';
import {EncryptionService} from '../api/encryption.service';
import {EncryptionKey} from '../models/encryption-key';
import {Router} from '@angular/router';

@Component({
  selector: 'app-key-create',
  templateUrl: './key-create.component.html',
  styleUrls: ['./key-create.component.scss']
})
export class KeyCreateComponent implements OnInit {
  private encryptionKey: EncryptionKey = new EncryptionKey();
  password: string;

  constructor(private encryptionKeyService: EncryptionKeyService, private encryptionService: EncryptionService, private router: Router) {
  }

  ngOnInit() {
    this.encryptionKey = new EncryptionKey();
  }

  async create() {
    console.log('create pass', this.password);
    const derivedPassword = await this.encryptionService.derivePassword(this.encryptionKey, this.password);
    this.encryptionKey.hash = await this.encryptionService.hashDerivedPassword(this.encryptionKey, derivedPassword);
    this.encryptionKeyService.create(this.encryptionKey).subscribe((encryptionKey) => {
      this.router.navigate(['/key/load', encryptionKey.id]);
    });
  }
}
