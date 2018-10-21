import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RealEstateDetailsPage } from './real-estate-details';

@NgModule({
  declarations: [
    RealEstateDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RealEstateDetailsPage),
  ],
})
export class RealEstateDetailsPageModule {}
