export class EncryptionKey {
  id: number;
  name: string;
  hash: string;
  algorithm = 'SHA-512';
  iterations = 5000;
}
