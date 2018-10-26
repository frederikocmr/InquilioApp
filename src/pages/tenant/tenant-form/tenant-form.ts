import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TenantAccount } from '../../../models/tenant-account';

@IonicPage()
@Component({
  selector: 'page-tenant-form',
  templateUrl: 'tenant-form.html',
})
export class TenantFormPage {
  editing: Boolean = false;
  tenant: TenantAccount = new TenantAccount();

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    if(this.navParams.get('tenant')){
      this.tenant = navParams.get('tenant');
      this.editing = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TenantFormPage');
  }

  addTenant() {
    this.navCtrl.pop();
  }

}
