import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-real-estate-details',
  templateUrl: 'real-estate-details.html',
})
export class RealEstateDetailsPage {
  realEstate = {name: "", description: "", link: ""};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.realEstate.name = "Imóvel teste 1";
    this.realEstate.description = "Descrição de teste do imóvel 1."
    this.realEstate.link = "imovel.com.br"
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RealEstateDetailsPage');
  }

  goBack() {
    this.navCtrl.pop();
  }

}
