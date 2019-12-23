import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Api} from '../../api/api.service';
import {AppService} from '../../api/app.service';
import {EncryptionKeyProvider} from "../../providers/encryption-key-provider";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  messageForm: FormGroup;
  submitted = false;
  loginError = false;

  constructor(private formBuilder: FormBuilder, private api: Api, private appService: AppService,
              private encryptionKeyProvider: EncryptionKeyProvider, private router: Router) {
  }

  ngOnInit() {
    this.messageForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.messageForm.invalid) {
      console.log(this.messageForm.invalid);
      return;
    }

    this.api.login(this.messageForm.controls.username.value, this.messageForm.controls.password.value)
      .subscribe(data => {
        this.appService.onLogin(data.token);
        this.encryptionKeyProvider.load().then(v => {
          this.router.navigate(['/']);
        });
      }, error => {

        console.log('login error');
        this.loginError = true;
      });
  }

}
