import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RealEstate } from '../../../models/real-estate';
import { UiProvider } from '../../../providers/ui/ui';
import { RealEstateFormPage } from './../real-estate-form/real-estate-form';

@IonicPage()
@Component({
  selector: 'page-real-estate-details',
  templateUrl: 'real-estate-details.html',
})
export class RealEstateDetailsPage {
  realEstate: RealEstate = new RealEstate();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public ui: UiProvider, 
    private modalCtrl: ModalController) {
    this.realEstate = navParams.get('realEstateObj');
  }

  onEditRealEstate() {
    let detailsModal = this.modalCtrl.create(RealEstateFormPage, { realEstateObj: this.realEstate });
    detailsModal.present();
  }

}
