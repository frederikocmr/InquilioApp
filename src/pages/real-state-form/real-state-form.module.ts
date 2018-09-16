import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RealStateFormPage } from './real-state-form';

@NgModule({
  declarations: [
    RealStateFormPage,
  ],
  imports: [
    IonicPageModule.forChild(RealStateFormPage),
  ],
})
export class RealStateFormPageModule {}
