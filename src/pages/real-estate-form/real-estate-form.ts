import { RealEstate } from './../../models/real-estate';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-real-estate-form',
  templateUrl: 'real-estate-form.html',
})
export class RealEstateFormPage {
  public realEstate: RealEstate;

  constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     private fb: FirebaseProvider) {

  }

  addRealEstate(){
    this.realEstate = {
      name: "Teste", 
      description: "Teste",
      zip: "454", 
      street: "55", 
      number: "Testeas", 
      complement: "11212", 
      district: "3131", 
      city: "3434", 
      state: "5345", 
      type: "644646", 
      link: "7767", 
      active: null, 
      tenantHistory: [], 
      ownerId: "123" };
    this.fb.insertData('RealEstate', this.realEstate);
    
  }

}
