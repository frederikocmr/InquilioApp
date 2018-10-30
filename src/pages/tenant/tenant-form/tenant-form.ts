import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TenantAccount } from '../../../models/tenant-account';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { regexValidators } from '../../../validators/validator';

@IonicPage()
@Component({
  selector: 'page-tenant-form',
  templateUrl: 'tenant-form.html',
})
export class TenantFormPage {
  editing: Boolean = false;
  tenant: TenantAccount = new TenantAccount();
  tenantForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public navCtrl: NavController, public navParams: NavParams) { 
    if(this.navParams.get('tenant')){
      this.tenant = navParams.get('tenant');
      this.editing = true;
    }
    
    this.tenantForm = this.formBuilder.group({
      document: ['', Validators.compose([Validators.pattern(regexValidators.cpfCpnj), Validators.required])],
      name: ['', Validators.required],
      phone: ['', Validators.compose([Validators.pattern(regexValidators.phone), Validators.required])],
      email: ['', Validators.compose([Validators.pattern(regexValidators.email), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TenantFormPage');
  }

  addTenant() {
    this.navCtrl.pop();
  }

}
