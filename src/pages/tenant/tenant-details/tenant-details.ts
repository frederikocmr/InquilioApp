import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TenantAccount } from '../../../models/tenant-account';
import { TenantEvaluationPage } from '../tenant-evaluation/tenant-evaluation';

@Component({
  selector: 'page-tenant-details',
  templateUrl: 'tenant-details.html',
})
export class TenantDetailsPage {
  public tenant = new TenantAccount;
  evaluationNumber = 1;
  overallScore = "4.5";
  // public isEvaluationTime: boolean = false;
  public isTenantAssociated: boolean = true;
  chips = [
    "Paga sempre em dia",
    "Conserva bem o imóvel",
    "Tem bom relacionamento com os vizinhos"
  ];

  constructor(private modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams) {
    if (navParams.get('tenant')) {
      this.tenant = navParams.get('tenant');
    }
  }

  // Allows the owner to associate a tenant with a real estate or a contract
  // public associateTenant(): void {}

  // Shows the tenant evaluation modal (page)
  public evaluateTenant(): void {
    let modal = this.modalCtrl.create(TenantEvaluationPage, { tenantObj: this.tenant  });
    modal.present();
  }

  // Makes a tenant disabled (hidden) in the owner's vision
  public removeTenant(): void {}
}
