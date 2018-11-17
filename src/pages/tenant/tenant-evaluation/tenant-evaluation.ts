import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UiProvider, FirebaseProvider } from '../../../providers';
import { RealEstate } from './../../../models/real-estate';
import { TenantAccount } from '../../../models/tenant-account';
import { Contract } from '../../../models/contract';
import { Score } from '../../../models/score';

@Component({
  selector: 'page-tenant-evaluation',
  templateUrl: 'tenant-evaluation.html',
})
export class TenantEvaluationPage {
  public tenant: TenantAccount;
  public realEstate: RealEstate;
  public contract: Contract;
  public score: Score = new Score();
  public notification: number;
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
    public fb: FirebaseProvider,
    private afDb: AngularFirestore,
    private alertCtrl: AlertController) {
    
    if (navParams.get('tenantObj')) {
      this.tenant = navParams.get('tenantObj');
    }

    if(navParams.get('contractObj')){
      this.contract = navParams.get('contractObj');
      this.getRealEstate();
    }

    if(navParams.get('notificationId')){
      this.notification = navParams.get('notificationId');
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

  private clearNotification(): void{

    let json = `{"${this.notification}":{
      "active": false,
      "datetime": ${this.notification},
      "type": "Contract"
  }}`;
   let updateData = JSON.parse(json);

   this.afDb.collection("Notification").doc(this.fb.user.uid).update(updateData);
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

    this.score.overallScore = value;
    this.getScoreItems(value);

    let evaluateDiv = window.document.getElementById("evaluate");
    evaluateDiv.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});    
  }

  public saveEvaluation(): void { 
    this.score.paymentScore = (this.scoreItems[0].checked ? this.score.overallScore : null);
    this.score.contractScore = (this.scoreItems[1].checked ? this.score.overallScore : null);
    this.score.carefulScore = (this.scoreItems[2].checked ? this.score.overallScore : null);
    this.score.discretionScore = (this.scoreItems[3].checked ? this.score.overallScore : null);

    this.score.contractId = this.contract.id;
    this.score.tenantId = this.contract.tenantId;

    // TODO: salvar no banco o Score. Na hora de recuperar, percorrer os resultados e pegar a média de cada item...
    this.fb.insertDataToCollection('Score', this.score).then(()=>{
      this.ui.showToast("Avaliação salva com sucesso!", 4, "top");
      if(this.notification){
        this.clearNotification();
      }
      this.navCtrl.pop();
    });
  }
}
