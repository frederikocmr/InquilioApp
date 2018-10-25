import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contract } from '../../../models/contract';

@IonicPage()
@Component({
  selector: 'page-contract-details',
  templateUrl: 'contract-details.html',
})
export class ContractDetailsPage {
  contract: Contract = new Contract();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.contract = navParams.get('contract');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractDetailsPage');
  }

}
