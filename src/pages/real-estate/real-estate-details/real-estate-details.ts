import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseProvider, UiProvider } from './../../../providers';
import { RealEstate } from '../../../models/real-estate';
import { RealEstateFormPage } from './../real-estate-form/real-estate-form';
import { ContractFormPage } from '../../contract/contract-form/contract-form';

@IonicPage()
@Component({
  selector: 'page-real-estate-details',
  templateUrl: 'real-estate-details.html',
})
export class RealEstateDetailsPage {
  public inquilino = false;
  public realEstate: RealEstate = new RealEstate();
  public realEstateType: String = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private modalCtrl: ModalController,
    private fb: FirebaseProvider) {
      this.realEstate = navParams.get('realEstateObj');
      this.getRealEstateType();
  }

  public getRealEstateType(): string {
    switch (this.realEstate.type) {
      case 'a': return "Apartamento";
      case 'c': return "Casa";
      case 'k': return "Kitnet";
      case 'q': return "Quarto";
      case 'o': return "Outro";
      default: return "Outro";
    }
  }

  public newContract(): void {
    let modal = this.modalCtrl.create(ContractFormPage);
    modal.present();
  }

  public onEditRealEstate(): void {
    let detailsModal = this.modalCtrl.create(RealEstateFormPage, { realEstateObj: this.realEstate });
    detailsModal.present();
  }

  public removeRealEstate(): void {
    let modal = this.ui.alertCtrl.create({
      title: "Remover Imóvel?",
      subTitle: "Essa ação é permanente e não pode ser desfeita.",
      buttons: ["Cancelar",
        {
          text: "Remover",
          handler: () => {
            this.fb.deactivateDataFromCollection('RealEstate', this.realEstate).then(() => {
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
