import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TenantAccount } from '../../../models/tenant-account';
import { TenantEvaluationPage } from '../tenant-evaluation/tenant-evaluation';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contract } from '../../../models/contract';

@Component({
  selector: 'page-tenant-details',
  templateUrl: 'tenant-details.html',
})
export class TenantDetailsPage {
  public tenant: TenantAccount = new TenantAccount;
  public contract: Contract;
  public evaluationNumber = 1;
  public overallScore = "4.5";
  // public isEvaluationTime: boolean = false;
  public isTenantAssociated: boolean = true;
  public chips = [
    "Paga sempre em dia",
    "Cumpre bem o contrato",
    "Conserva bem o imóvel",
    "Tem bom relacionamento com os vizinhos"
  ];

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    private afDb: AngularFirestore,
    public navParams: NavParams) {

    if (navParams.get('tenant')) {
      this.tenant = navParams.get('tenant');
      this.getContract();
    }
  }

  public getContract(): void {
    this.afDb.collection<Contract>(
      'Contract',
      ref => ref.where('tenantId', '==', this.tenant.id)
      .where("active", "==", true)
    ).valueChanges().subscribe(data => {
      if(data.length > 0 ){
        this.contract = data[0] as Contract;
      } 
    }); 
  }

  // Shows the tenant evaluation modal (page)
  public evaluateTenant(): void {
    let modal = this.modalCtrl.create(TenantEvaluationPage, { tenantObj: this.tenant, contractObj: this.contract  });
    modal.present();
  }

  // Makes a tenant disabled (hidden) in the owner's vision
  public removeTenant(): void {}
}
