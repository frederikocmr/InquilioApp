import { RealEstate } from './../../../models/real-estate';
import { FirebaseProvider } from './../../../providers/firebase/firebase';
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
      name: "Meu AP", 
      description: "Esta é o meu apartamento",
      zip: "74305440", 
      street: "Rua C-55", 
      number: "SN", 
      complement: "Apt 605", 
      district: "Setor Sudoeste", 
      city: "Goiania", 
      state: "GO", 
      type: "Apartamento", 
      link: "www.meuapt.com.br", 
      active: true, 
      tenantHistory: [], 
      ownerId: this.fb.user.uid
    };
    this.fb.insertDataToCollection('RealEstate', this.realEstate);
    
  }

}
