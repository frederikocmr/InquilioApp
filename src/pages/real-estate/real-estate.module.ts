import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RealEstatePage } from './real-estate';

@NgModule({
  declarations: [
    RealEstatePage,
  ],
  imports: [
    IonicPageModule.forChild(RealEstatePage),
  ],
})
export class RealEstatePageModule {}
