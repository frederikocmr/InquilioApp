import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { TenantAccount } from '../../../models/tenant-account';
import { TenantEvaluationPage } from '../tenant-evaluation/tenant-evaluation';
import { AngularFirestore } from '@angular/fire/firestore';
import { Contract } from '../../../models/contract';
import { Score } from '../../../models/score';

@Component({
  selector: 'page-tenant-details',
  templateUrl: 'tenant-details.html',
})
export class TenantDetailsPage {
  public tenant: TenantAccount = new TenantAccount;
  public contract: Contract;
  public evaluationNumber = 1;
  public overallScore: number = 0;
  public countScore: number = 0;
  // public isEvaluationTime: boolean = false;
  public isTenantAssociated: boolean = true;
  public chips = new Array();

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    private afDb: AngularFirestore,
    public navParams: NavParams) {

    if (navParams.get('tenant')) {
      this.tenant = navParams.get('tenant');
      this.getContract();
      this.getScore();
    }
  }

  public getScore(): void {

    this.afDb.collection<Score>(
      'Score',
      ref => ref.where('tenantId', '==', this.tenant.id)
    ).valueChanges().subscribe(data => {
      let scoreAux = 0, carefulScoreAux = 0, contractScoreAux = 0, discretionScoreAux = 0, paymentScoreAux = 0;
      this.evaluationNumber = 0;
      this.overallScore = 0;
      data.forEach(item => {
        scoreAux += item.overallScore;
        carefulScoreAux += (item.carefulScore ? item.carefulScore : 0);
        contractScoreAux += (item.contractScore ? item.contractScore : 0);
        discretionScoreAux += (item.discretionScore ? item.discretionScore : 0);
        paymentScoreAux += (item.paymentScore ? item.paymentScore : 0);
        this.evaluationNumber += 1;
      });
      this.overallScore = +(scoreAux / this.evaluationNumber).toFixed(2);

      this.getCarefulScore(carefulScoreAux / this.evaluationNumber);
      this.getContractScore(contractScoreAux / this.evaluationNumber);
      this.getDiscretionScore(discretionScoreAux / this.evaluationNumber);
      this.getPaymentScore(paymentScoreAux / this.evaluationNumber);

    });
  }

  public getContract(): void {
    this.afDb.collection<Contract>(
      'Contract',
      ref => ref.where('tenantId', '==', this.tenant.id)
        .where("active", "==", true)
    ).valueChanges().subscribe(data => {
      if (data.length > 0) {
        this.contract = data[0] as Contract;
      }
    });
  }

  public getDateString(date): string {
    return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  // Shows the tenant evaluation modal (page)
  public evaluateTenant(): void {
    let modal = this.modalCtrl.create(TenantEvaluationPage, { tenantObj: this.tenant, contractObj: this.contract });
    modal.present();
  }

  // Makes a tenant disabled (hidden) in the owner's vision
  public removeTenant(): void { }

  public getPaymentScore(score: number) {
    if ((score >= 4) && (score < 5)) {
      this.chips.push("Paga em dia");
    } else if (score >= 5) {
      this.chips.push("Paga sempre em dia ou antecipadamente");
    } 
  }
  public getContractScore(score) {
    if ((score >= 4) && (score < 5)) {
      this.chips.push("Cumpre o contrato");
    } else if (score >= 5) {
      this.chips.push("Cumpre integralmente o contrato");
    } 
  }
  public getCarefulScore(score) {
    if ((score >= 4) && (score < 5)) {
      this.chips.push("Conserva bem o imóvel");
    } else if (score >= 5) {
      this.chips.push("Se preocupa em manter a conservação do imóvel");
    }
  }
  public getDiscretionScore(score) {
    if ((score >= 4) && (score < 5)) {
      this.chips.push("Bom relacionamento com os vizinhos");
    } else if (score >= 5) {
      this.chips.push("Excelente relacionamento com os vizinhos");
    } 
  }
}
