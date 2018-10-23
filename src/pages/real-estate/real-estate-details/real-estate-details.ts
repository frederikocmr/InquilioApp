import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { RealEstate } from '../../../models/real-estate';
import { RealEstateFormPage } from './../real-estate-form/real-estate-form';

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
    private modalCtrl: ModalController) {
    this.realEstate = navParams.get('realEstateObj');
    this.getRealEstateType();
  }
  
  getRealEstateType() {
    switch(this.realEstate.type) {
      case 'a': this.realEstateType = "Apartamento"; break;
      case 'c': this.realEstateType = "Casa"; break;
      case 'k': this.realEstateType = "Kitnet"; break;
      case 'q': this.realEstateType = "Quarto"; break;
      case 'o': this.realEstateType = "Outro"; break;
      default: this.realEstateType = "Outro"; break;
    }
  }

  onEditRealEstate() {
    let detailsModal = this.modalCtrl.create(RealEstateFormPage, { realEstateObj: this.realEstate });
    detailsModal.present();
  }

}
