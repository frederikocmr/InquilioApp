import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFirestore } from "@angular/fire/firestore";
import { Contract } from '../../../models/contract';
import { FirebaseProvider } from '../../../providers';
import { UiProvider } from './../../../providers';
import { RealEstate } from '../../../models/real-estate';
import { ContractFormPage } from '../contract-form/contract-form';
import { TenantAccount } from '../../../models/tenant-account';

@IonicPage()
@Component({
  selector: 'page-contract-details',
  templateUrl: 'contract-details.html',
})
export class ContractDetailsPage {
  public contract: Contract = new Contract();
  public currentRealEstate:  RealEstate = null;
  public currentTenant: TenantAccount = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private modalCtrl: ModalController,
    private afDb: AngularFirestore,
    private fb: FirebaseProvider
  ) {
    this.contract = navParams.get('contract');
    this.afDb.doc<RealEstate>('RealEstate/' + this.contract.realEstateId).valueChanges().
      subscribe((data) => {
        this.currentRealEstate = data;
        console.log(this.currentRealEstate);
      });

  }

  public getDateString(date): string {
    return new Date(date).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
  }

  public getRealEstateType(): string {
    switch (this.currentRealEstate.type) {
      case 'a': return "Apartamento";
      case 'c': return "Casa";
      case 'k': return "Kitnet";
      case 'q': return "Quarto";
      case 'o': return "Outro";
      default: return "Outro";
    }
  }

  public onEditContract(): void {
    let detailsModal = this.modalCtrl.create(ContractFormPage, { contract: this.contract });
    detailsModal.present();
  }

  public removeContract(): void{
    let modal = this.ui.alertCtrl.create({
      title: "Remover Contrato?",
      subTitle: "Essa ação é permanente e não pode ser desfeita.",
      buttons: ["Cancelar",
        {
          text: "Remover",
          handler: () => {
            this.fb.deactivateDataFromCollection('Contract', this.contract).then(() => {
              this.ui.showToast(this.fb.message, 2, 'top');
              if (this.fb.validator) {
                this.navCtrl.pop();
              }
            }).catch((error) => {
              this.ui.showAlert("Erro ao desativar", error);
            });
          }
        }]
    });

    modal.present();

  }
}
