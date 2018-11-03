import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TenantEvaluationPage } from './tenant-evaluation';

@NgModule({
  declarations: [
    TenantEvaluationPage,
  ],
  imports: [
    IonicPageModule.forChild(TenantEvaluationPage),
  ],
})
export class TenantEvaluationPageModule {}
