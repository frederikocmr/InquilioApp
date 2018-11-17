import { NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  public tenant: TenantAccount;
  public realEstate: RealEstate;
  public contract: Contract;
  public evaluationForm: FormGroup;
  public overallScore: number = 0;
  public scoreItems;
  public scoreQuestion;
  public stars = [
    { value: 1, name: "custom-star-border" },
    { value: 2, name: "custom-star-border" },
    { value: 3, name: "custom-star-border" },
    { value: 4, name: "custom-star-border" },
    { value: 5, name: "custom-star-border" }
  ];

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private afDb: AngularFirestore,
    private alertCtrl: AlertController) {
    this.evaluationForm = this.formBuilder.group({});
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
      title: "Você tem certeza de que deseja sair?",
      message: "Se fizer isto agora, perderá a chance de avaliar desta vez.",
      buttons: [
        { text: "Recusar", role: 'cancel' },
        { text: "Confirmar", handler: () => {  this.navCtrl.pop(); } }
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
          "Nunca pagou em dia",
          "Não cumpriu integralmente as normas do contrato",
          "Não conservou o imóvel",
          "Péssimo relacionamento com os vizinhos"
        ];
        this.scoreQuestion = "Nossa, o que aconteceu?";
        break;
      case 2:
        this.scoreItems = [
          "Atrasou o pagamento (algumas vezes)",
          "Não cumpriu parte das normas do contrato",
          "Não se preocupou em conservar o imóvel",
          "Relacionamento instável com os vizinhos"
        ];
        this.scoreQuestion = "Ué, qual foi o problema?";
        break;
      case 3:
        this.scoreItems = [
          "Não atrasar o pagamento",
          "Se atentar as normas do contrato",
          "Conservar o imóvel",
          "Relacionamento com os vizinhos"
        ];
        this.scoreQuestion = "O que poderia ser melhor?";
        break;
      case 4:
        this.scoreItems = [
          "Pagou em dia",
          "Cumpriu o contrato",
          "Conservou bem o imóvel",
          "Bom relacionamento com os vizinhos"
        ];
        this.scoreQuestion = "O que foi bom?";
        break;
      case 5:
        this.scoreItems = [
          "Pagou sempre em dia ou antecipadamente",
          "Cumpriu integralmente o contrato",
          "Se preocupou em manter a conservação do imóvel",
          "Excelente relacionamento com os vizinhos"
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
  }

  public saveEvaluation(): void { }
}
