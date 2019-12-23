import {Injectable} from '@angular/core';
import {EncryptionKey} from '../models/encryption-key';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  async encrypt(encryptionKey: EncryptionKey, plainText: string) {
    const key = await this.getCryptoKey(encryptionKey);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedPassword = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      this.stringToArrayBuffer(plainText)
    );

    const ivData = this.stringToHex(this.arrayBufferToString(iv));
    const cipherData = this.stringToHex(this.arrayBufferToString(encryptedPassword));

    return cipherData + ':' + ivData;
  }

  async decrypt(encryptionKey: EncryptionKey, cipher: string) {
    const key = await this.getCryptoKey(encryptionKey);
    const data = cipher.split(':');

    const iv = new Uint8Array(this.hexStringToArrayBuffer(this.hexToString(data[1])));
    const cipherData = this.stringToArrayBuffer(this.hexToString(data[0]));

    const encryptedPassword = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      key,
      cipherData
    );
    return this.arrayBufferToString(encryptedPassword);
  }

  private async getCryptoKey(encryptionKey: EncryptionKey) {
    if (!this.isEncryptionKeyLoaded(encryptionKey)) {
      throw new Error('Not loaded encryption key');
    }
    const rawEncryptionKey = this.stringToArrayBuffer(this.getEncryptionKey(encryptionKey)).slice(0, 16);

    return crypto.subtle.importKey(
      'raw',
      rawEncryptionKey,
      {
        generator: undefined, hash: undefined, length: 0, namedCurve: undefined, prime: undefined,
        name: 'AES-GCM'
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  isEncryptionKeyLoaded(encryptionKey: EncryptionKey) {
    return localStorage.getItem('ek_' + encryptionKey.id) !== null;
  }

  isEncryptionKeyIdLoaded(encryptionKeyId: number) {
    return localStorage.getItem('ek_' + encryptionKeyId) !== null;
  }

  async loadEncryptionKey(encryptionKey: EncryptionKey, password: string) {
    console.log('loadEncryptionKey start', +new Date());
    const derivedPassword = await this.derivePassword(encryptionKey, password);
    const derivedPasswordHash = await this.hashDerivedPassword(encryptionKey, derivedPassword);
    if (derivedPasswordHash !== encryptionKey.hash) {
      throw new Error('Invalid password to Encryption Key!');
    }
    const derivedPasswordString = this.arrayBufferToString(derivedPassword);
    localStorage.setItem('ek_' + encryptionKey.id, derivedPasswordString);
    console.log('loadEncryptionKey   end', +new Date());
  }

  unloadEncryptionKey(encryptionKey: EncryptionKey) {
    localStorage.removeItem('ek_' + encryptionKey.id);
  }

  getEncryptionKey(encryptionKey: EncryptionKey) {
    return localStorage.getItem('ek_' + encryptionKey.id);
  }

  async derivePassword(encryptionKey: EncryptionKey, plainPassword: string) {
    let derivedPassword = this.stringToArrayBuffer(plainPassword);
    for (let i = 0; i < encryptionKey.iterations; ++i) {
      derivedPassword = await crypto.subtle.digest(encryptionKey.algorithm, derivedPassword);
    }
    return derivedPassword;
  }

  async hashDerivedPassword(encryptionKey: EncryptionKey, password: ArrayBuffer) {
    const hash = await crypto.subtle.digest(encryptionKey.algorithm, password);
    const hashString = this.arrayBufferToString(hash);
    return this.stringToHex(hashString.substring(0, 6));
  }

  arrayBufferToString(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint16Array(buffer));
  }

  stringToArrayBuffer(value: string) {
    const buf = new ArrayBuffer(value.length * 2);
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = value.length; i < strLen; ++i) {
      bufView[i] = value.charCodeAt(i);
    }
    return buf;
  }

  hexStringToArrayBuffer(value: string) {
    const buf = new ArrayBuffer(value.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = value.length; i < strLen; ++i) {
      bufView[i] = value.charCodeAt(i) % 256;
    }
    return buf;
  }

  stringToHex(value: string) {
    let hex;
    let result = '';
    for (let i = 0; i < value.length; i++) {
      hex = value.charCodeAt(i).toString(16);
      result += ('000' + hex).slice(-4);
    }

    return result;
  }

  hexToString(value: string) {
    let asString = '';
    const hexes = value.match(/.{1,4}/g) || [];
    for (let j = 0; j < hexes.length; j++) {
      asString += String.fromCharCode(parseInt(hexes[j], 16));
    }
    return asString;
  }

}

