import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-real-estate-form',
  templateUrl: 'real-estate-form.html',
})
export class RealEstateFormPage {

  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     private fb: FirebaseProvider) {

  }

  addRealEstate(){
    
  }

}
