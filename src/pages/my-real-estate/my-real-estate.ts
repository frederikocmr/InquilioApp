import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RealEstateFormPage } from '../real-estate-form/real-estate-form';

@IonicPage()
@Component({
  selector: 'page-my-real-estate',
  templateUrl: 'my-real-estate.html',
})
export class MyRealEstatePage {
  realEstateFormPage = RealEstateFormPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyRealEstatePage');
  }

}
