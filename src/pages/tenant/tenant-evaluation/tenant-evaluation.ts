import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiProvider } from '../../../providers';
import { RealEstate } from './../../../models/real-estate';
import { TenantAccount } from '../../../models/tenant-account';
import { Contract } from '../../../models/contract';

@Component({
  selector: 'page-tenant-evaluation',
  templateUrl: 'tenant-evaluation.html',
})
export class TenantEvaluationPage {
  public comment: string;
  public tenant: TenantAccount;
  public realEstate: RealEstate;
  public contract: Contract;
  // public evaluationForm: FormGroup;
  public overallScore: number = 0;
  public paymentScore: number = 0;
  public contractScore: number = 0;
  public carefulScore: number = 0;
  public discretionScore: number = 0;
  public scoreItems;
  public scoreQuestion;
  public scoreItemsValue;
  public stars = [
    { value: 1, name: "custom-star-border" },
    { value: 2, name: "custom-star-border" },
    { value: 3, name: "custom-star-border" },
    { value: 4, name: "custom-star-border" },
    { value: 5, name: "custom-star-border" }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private afDb: AngularFirestore,
    private alertCtrl: AlertController) {
    
    if (navParams.get('tenantObj')) {
      this.tenant = navParams.get('tenantObj');
    }

    if(navParams.get('contractObj')){
      this.contract = navParams.get('contractObj');
      this.getRealEstate();
    }

  }

  public onClose(): void {
    const alert = this.alertCtrl.create({
      title: "Tem certeza?",
      message: "Ao sair você perderá esta chance de avaliar seu inquilino.",
      buttons: [
        { text: "Cancelar", role: 'cancel' },
        { text: "Sair", handler: () => {  this.navCtrl.pop(); } }
      ]
    });
    alert.present();
   
  }

  public getRealEstate(): void {
    this.afDb.doc<RealEstate>('RealEstate/' + this.contract.realEstateId).valueChanges().
      subscribe((data) => {
        this.realEstate = data;
      });
  }

  public getDateString(date): string {
    return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  private getScoreItems(score) {
    switch (score) {
      case 1:
        this.scoreItems = [
          {checked: false, text: "Nunca pagou em dia"},
          {checked: false, text: "Não cumpriu integralmente as normas do contrato"},
          {checked: false, text: "Não conservou o imóvel"},
          {checked: false, text: "Péssimo relacionamento com os vizinhos"}
        ];
        this.scoreQuestion = "Nossa, o que aconteceu?";
        break;
      case 2:
        this.scoreItems = [
          {checked: false, text: "Atrasou o pagamento (algumas vezes)"},
          {checked: false, text: "Não cumpriu parte das normas do contrato"},
          {checked: false, text: "Não se preocupou em conservar o imóvel"},
          {checked: false, text: "Relacionamento instável com os vizinhos"}
        ];
        this.scoreQuestion = "Ué, qual foi o problema?";
        break;
      case 3:
        this.scoreItems = [
          {checked: false, text: "Não atrasar o pagamento"},
          {checked: false, text: "Se atentar as normas do contrato"},
          {checked: false, text: "Conservar o imóvel"},
          {checked: false, text: "Relacionamento com os vizinhos"}
        ];
        this.scoreQuestion = "O que poderia ser melhor?";
        break;
      case 4:
        this.scoreItems = [
          {checked: false, text: "Pagou em dia"},
          {checked: false, text: "Cumpriu o contrato"},
          {checked: false, text: "Conservou bem o imóvel"},
          {checked: false, text: "Bom relacionamento com os vizinhos"}
        ];
        this.scoreQuestion = "O que foi bom?";
        break;
      case 5:
        this.scoreItems = [
          {checked: false, text: "Pagou sempre em dia ou antecipadamente"},
          {checked: false, text: "Cumpriu integralmente o contrato"},
          {checked: false, text: "Se preocupou em manter a conservação do imóvel"},
          {checked: false, text: "Excelente relacionamento com os vizinhos"}
        ];
        this.scoreQuestion = "Perfeito, gostaria de destacar algo?";
        break;
    }
  }

  public getStarName(value): void {
    this.stars.forEach(star => {
      if (star.value <= value) {
        star.name = "custom-star-full";
      } else {
        star.name = "custom-star-border";
      }
    });

    this.overallScore = value;
    this.getScoreItems(value);

    let evaluateDiv = window.document.getElementById("evaluate");
    evaluateDiv.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});    
  }

  public getScoreCalc():void {
    // this.overallScore += (this.tenant.overallScore ? this.tenant.overallScore : 0 );
    
    this.paymentScore = (this.scoreItems[0].checked ? this.overallScore : null);
    this.contractScore = (this.scoreItems[1].checked ? this.overallScore : null);
    this.carefulScore = (this.scoreItems[2].checked ? this.overallScore : null);
    this.discretionScore = (this.scoreItems[3].checked ? this.overallScore : null);
  }

  public saveEvaluation(): void { 
    this.getScoreCalc();

    console.log("Tenant", this.tenant);
    console.log("Stars Selected", this.overallScore);
    console.log("Items", this.scoreItems);
    console.log("\nScores");
    console.log("Payment", this.paymentScore);
    console.log("Contract", this.contractScore);
    console.log("Careful", this.carefulScore);
    console.log("Discretion", this.discretionScore);
    console.log("\nComment", this.comment);


    this.tenant.overallScore = this.overallScore; 
    this.tenant.paymentScore = null;
    this.tenant.carefulScore = null;
    this.tenant.discretionScore = null;
    //this.tenant.contracts.push(this.contract.id);
  }
}
