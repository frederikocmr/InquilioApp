import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TenantFormPage } from './tenant-form';

@NgModule({
  declarations: [
    TenantFormPage,
  ],
  imports: [
    IonicPageModule.forChild(TenantFormPage),
  ],
})
export class TenantFormPageModule {}
