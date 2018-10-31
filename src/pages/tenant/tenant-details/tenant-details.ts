import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TenantAccount } from '../../../models/tenant-account';

@IonicPage()
@Component({
  selector: 'page-tenant-details',
  templateUrl: 'tenant-details.html',
})
export class TenantDetailsPage {
  public tenant: TenantAccount;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tenant = navParams.get('tenant');
  }
}
