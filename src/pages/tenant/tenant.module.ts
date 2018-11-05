import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TenantPage } from './tenant';

@NgModule({
  declarations: [
    TenantPage,
  ],
  imports: [
    IonicPageModule.forChild(TenantPage),
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class TenantPageModule {}
