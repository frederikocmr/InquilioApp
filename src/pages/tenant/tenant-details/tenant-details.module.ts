import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TenantDetailsPage } from './tenant-details';

@NgModule({
  declarations: [
    TenantDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TenantDetailsPage),
  ],
})
export class TenantDetailsPageModule {}
