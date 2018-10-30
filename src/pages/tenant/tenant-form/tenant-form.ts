import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TenantAccount } from '../../../models/tenant-account';
import { UiProvider, FirebaseProvider } from '../../../providers';

@IonicPage()
@Component({
  selector: 'page-tenant-form',
  templateUrl: 'tenant-form.html',
})
export class TenantFormPage {
  public editing: Boolean = false;
  public tenant: TenantAccount = new TenantAccount();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private fb: FirebaseProvider) {
    if (this.navParams.get('tenant')) {
      this.tenant = navParams.get('tenant');
      this.editing = true;
    }
  }

  public addTenant(): void {
    this.ui.showLoading();
    if (!this.editing) {
      this.tenant.relHistory = [{ownerId: this.fb.user.uid, realEstateId: '' }];
      this.tenant.ownerHistory = [this.fb.user.uid];
      this.fb.insertDataToCollection('TenantAccount', this.tenant).then(() => {
        this.ui.closeLoading();
        this.ui.showToast(this.fb.message, 2, 'top');

        if (this.fb.validator) {
          this.navCtrl.pop();
        }
      }).catch((error) => {
        this.ui.closeLoading();
        this.ui.showAlert("Erro ao cadastrar", error);
      });
    } else {

      this.fb.updateDataFromCollection('TenantAccount', this.tenant).then(() => {
        this.ui.closeLoading();
        this.ui.showToast(this.fb.message, 2, 'top');

        if (this.fb.validator) {
          this.navCtrl.pop();
        }
      }).catch((error) => {
        this.ui.closeLoading();
        this.ui.showAlert("Erro ao editar", error);
      });

    }
  }

}
