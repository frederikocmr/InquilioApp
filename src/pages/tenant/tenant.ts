import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  PopoverController
} from "ionic-angular";
import { TenantFormPage } from "./tenant-form/tenant-form";
import { TenantDetailsPage } from "./tenant-details/tenant-details";
import { Observable } from "rxjs/Observable";
import { TenantAccount } from "../../models/tenant-account";
import { UiProvider } from "../../providers";
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { ListOptionsComponent } from "../../components/list-options/list-options";

@Component({
  selector: "page-tenant",
  templateUrl: "tenant.html"
})
export class TenantPage {
  public searchingTenants: boolean = false;
  public tenants: Observable<TenantAccount[]>;
  public tenantsExists: boolean = false;
  public searchString: string = '';

  constructor(
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController,
    private afDb: AngularFirestore,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider
  ) {

  }

  public cancelSearch(): void {
    this.searchingTenants = false;
    this.tenantsExists = false;
    this.tenants = null;
  }

  public presentPopover(myEvent): void {
    let popover = this.popoverCtrl.create(ListOptionsComponent, {type: 'tenant'});
    popover.present({
      ev: myEvent
    });
  }

  public newTenant(): void {
    let modal = this.modalCtrl.create(TenantFormPage);
    modal.present();
  }

  public search(): void {
    if (this.searchString.length == 14) {
      //TODO: Quando ativar esta funcao, criar um loading na tela sem ser o do ui...
      this.tenants = this.afDb.collection<TenantAccount>(
        'tenantAccount',
        ref => ref.where("document", "==", this.searchString).where("active", "==", true)
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as TenantAccount;
          const id = a.payload.doc.id;
          data.id = id;
          this.tenantsExists = true;

          return { id, ...data };
        }))
      );
    }
  }

  public viewDetails(tenant): void {
    this.navCtrl.push(TenantDetailsPage, { tenant: tenant });
    // let detailsModal = this.modalCtrl.create(TenantDetailsPage, {tenant: tenant});
    // detailsModal.present();
  }
}
