import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {JwtModule} from '@auth0/angular-jwt';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavComponent} from './components/nav/nav.component';
import {AboutComponent} from './components/about/about.component';
import {LoginComponent} from './components/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ListComponent} from './components/datarow/list.component';
import {EditComponent} from './components/datarow/edit.component';
import {DetailsComponent} from './components/datarow/details.component';
import {EncryptionKeyProvider} from './providers/encryption-key-provider';
import {Api} from './api/api.service';
import {CreateComponent} from './components/datarow/create.component';
import {EditPasswordComponent} from './components/datarow/edit-password.component';
import {EncryptionKeyPickerComponent} from './components/encryption-key-picker/encryption-key-picker.component';
import {ErrorComponent} from './components/error/error.component';
import { KeyListComponent } from './key-list/key-list.component';
import { KeyLoadComponent } from './key-load/key-load.component';
import { KeyUnloadComponent } from './key-unload/key-unload.component';
import { KeyCreateComponent } from './key-create/key-create.component';

import {config} from './config';
import {EditRecoveryInfoComponent} from "./components/datarow/edit-recovery-info.component";

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

export function encryptionKeyProviderFactory(provider: EncryptionKeyProvider) {
  return () => provider.load();
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AboutComponent,
    LoginComponent,
    ListComponent,
    CreateComponent,
    EditComponent,
    EditPasswordComponent,
    EditRecoveryInfoComponent,
    DetailsComponent,
    EncryptionKeyPickerComponent,
    ErrorComponent,
    KeyListComponent,
    KeyLoadComponent,
    KeyUnloadComponent,
    KeyCreateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: config.jwtWhitelist,
        blacklistedRoutes: []
      }
    }),
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    Api,
    EncryptionKeyProvider,
    {provide: APP_INITIALIZER, useFactory: encryptionKeyProviderFactory, deps: [EncryptionKeyProvider], multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
