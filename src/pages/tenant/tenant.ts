import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { TenantFormPage } from "./tenant-form/tenant-form";
import { TenantDetailsPage } from "./tenant-details/tenant-details";
import { Observable } from "rxjs/Observable";
import { TenantAccount } from "../../models/tenant-account";
import { UiProvider, FirebaseProvider } from "../../providers";
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';

@IonicPage()
@Component({
  selector: "page-tenant",
  templateUrl: "tenant.html"
})
export class TenantPage {
  public tenants: Observable<TenantAccount[]>;
  public tenantsExists: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider
  ) {
    this.ui.showLoading();
    this.tenants = this.afDb.collection<TenantAccount>(
      'TenantAccount',
      ref => ref.where("ownerHistory", "array-contains", this.fb.user.uid).where("active", "==", true)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as TenantAccount;
        const id = a.payload.doc.id;
        data.id = id;
        
        this.ui.closeLoading();
        return { id, ...data };
      }))
    );

  }

  public newTenant(): void {
    let modal = this.modalCtrl.create(TenantFormPage);
    modal.present();
  }

  public viewDetails(tenant): void {
    this.navCtrl.push(TenantDetailsPage, {tenant: tenant});
    // let detailsModal = this.modalCtrl.create(TenantDetailsPage, {tenant: tenant});
    // detailsModal.present();
  }
}
