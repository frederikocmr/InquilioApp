import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyRealEstatePage } from './my-real-estate';

@NgModule({
  declarations: [
    MyRealEstatePage,
  ],
  imports: [
    IonicPageModule.forChild(MyRealEstatePage),
  ],
})
export class MyRealEstatePageModule {}
