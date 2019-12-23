import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ListComponent} from './components/datarow/list.component';
import {AboutComponent} from './components/about/about.component';
import {LoginComponent} from './components/login/login.component';
import {EditComponent} from './components/datarow/edit.component';
import {DetailsComponent} from './components/datarow/details.component';
import {CreateComponent} from './components/datarow/create.component';
import {EditPasswordComponent} from './components/datarow/edit-password.component';
import {KeyListComponent} from './key-list/key-list.component';
import {KeyCreateComponent} from './key-create/key-create.component';
import {KeyUnloadComponent} from './key-unload/key-unload.component';
import {KeyLoadComponent} from './key-load/key-load.component';
import {EditRecoveryInfoComponent} from './components/datarow/edit-recovery-info.component';

const routes: Routes = [
  {path: 'key/list', component: KeyListComponent},
  {path: 'key/load/:id', component: KeyLoadComponent},
  {path: 'key/unload/:id', component: KeyUnloadComponent},
  {path: 'key/create', component: KeyCreateComponent},
  {path: 'key/list', component: KeyListComponent},
  {path: 'password/list', component: ListComponent},
  {path: 'password/create', component: CreateComponent},
  {path: 'password/edit/:id', component: EditComponent},
  {path: 'password/edit-password/:id', component: EditPasswordComponent},
  {path: 'password/edit-recovery-info/:id', component: EditRecoveryInfoComponent},
  {path: 'password/details/:id', component: DetailsComponent},
  {path: 'about', component: AboutComponent},
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: '/key/list', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
