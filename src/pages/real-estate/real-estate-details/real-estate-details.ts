import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RealEstate } from '../../../models/real-estate';
import { UiProvider } from '../../../providers/ui/ui';

@IonicPage()
@Component({
  selector: 'page-real-estate-details',
  templateUrl: 'real-estate-details.html',
})
export class RealEstateDetailsPage {
  realEstate: RealEstate = new RealEstate();

  constructor(public navCtrl: NavController, public navParams: NavParams, public ui: UiProvider) {
    this.realEstate = navParams.get('realEstateObj');
  }

}
