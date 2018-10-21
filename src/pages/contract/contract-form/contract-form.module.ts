import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractFormPage } from './contract-form';

@NgModule({
  declarations: [
    ContractFormPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractFormPage),
  ],
})
export class ContractFormPageModule {}
