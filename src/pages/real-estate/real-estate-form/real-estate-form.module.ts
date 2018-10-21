import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RealEstateFormPage } from './real-estate-form';

@NgModule({
  declarations: [
    RealEstateFormPage,
  ],
  imports: [
    IonicPageModule.forChild(RealEstateFormPage),
  ],
})
export class RealStateFormPageModule {}
