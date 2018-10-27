import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { TenantFormPage } from "./tenant-form/tenant-form";
import { TenantDetailsPage } from "./tenant-details/tenant-details";

@IonicPage()
@Component({
  selector: "page-tenant",
  templateUrl: "tenant.html"
})
export class TenantPage {
  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad TenantPage");
  }

  newTenant() {
    let modal = this.modalCtrl.create(TenantFormPage);
    modal.present();
  }

  viewDetails(tenant) {
    this.navCtrl.push(TenantDetailsPage, {tenant: tenant});
    // let detailsModal = this.modalCtrl.create(TenantDetailsPage, {tenant: tenant});
    // detailsModal.present();
  }
}
