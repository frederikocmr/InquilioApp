import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { TenantAccount } from '../../../models/tenant-account';
import { TenantEvaluationPage } from '../tenant-evaluation/tenant-evaluation';

@IonicPage()
@Component({
  selector: 'page-tenant-details',
  templateUrl: 'tenant-details.html',
})
export class TenantDetailsPage {
  public tenant = {
    document: "***.***.*00-00",
    email: "email@teste.com",
    phone: "(00) 9 8765-4321"    
  };
  overallScore = "4.5";
  // public isEvaluationTime: boolean = false;
  public isTenantAssociated: boolean = true;
  chips = [
    {label: "Paga sempre em dia"},
    {label: "Conserva bem o imóvel"},
    {label: "Tem bom relacionamento com os vizinhos"}
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
    let modal = this.modalCtrl.create(TenantEvaluationPage);
    modal.present();
  }

  // Makes a tenant disabled (hidden) in the owner's vision
  public removeTenant(): void {}
}
