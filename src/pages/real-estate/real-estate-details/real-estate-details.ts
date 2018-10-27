import { FirebaseProvider } from './../../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UiProvider } from './../../../providers/ui/ui';
import { RealEstate } from '../../../models/real-estate';
import { RealEstateFormPage } from './../real-estate-form/real-estate-form';
import { ContractFormPage } from '../../contract/contract-form/contract-form';

@IonicPage()
@Component({
  selector: 'page-real-estate-details',
  templateUrl: 'real-estate-details.html',
})
export class RealEstateDetailsPage {
  inquilino = false;
  realEstate: RealEstate = new RealEstate();
  realEstateType: String = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private modalCtrl: ModalController,
    private fb: FirebaseProvider) {
      this.realEstate = navParams.get('realEstateObj');
      this.getRealEstateType();
  }

  getRealEstateType() {
    switch (this.realEstate.type) {
      case 'a': this.realEstateType = "Apartamento"; break;
      case 'c': this.realEstateType = "Casa"; break;
      case 'k': this.realEstateType = "Kitnet"; break;
      case 'q': this.realEstateType = "Quarto"; break;
      case 'o': this.realEstateType = "Outro"; break;
      default: this.realEstateType = "Outro"; break;
    }
  }

  newContract() {
    let modal = this.modalCtrl.create(ContractFormPage);
    modal.present();
  }

  onEditRealEstate() {
    let detailsModal = this.modalCtrl.create(RealEstateFormPage, { realEstateObj: this.realEstate });
    detailsModal.present();
  }

  removeRealEstate() {
    let modal = this.ui.alertCtrl.create({
      title: "Remover",
      subTitle: "Tem certeza que deseja remover este imóvel?",
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
