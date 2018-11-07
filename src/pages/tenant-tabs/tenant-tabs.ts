import { Component } from "@angular/core";

import { TimelinePage } from "../timeline/timeline";
import { SettingsPage } from "../settings/settings";
import { UiProvider, FirebaseProvider } from "../../providers";
import { AngularFirestore } from "@angular/fire/firestore";
import { TabsPage } from "../tabs/tabs";
import { NavController } from "ionic-angular";
import { ContractDetailsPage } from "../contract/contract-details/contract-details";

@Component({
  templateUrl: "tenant-tabs.html"
})
export class TenantTabsPage {
  timelinePage = TimelinePage;
  contractDetailsPage = ContractDetailsPage;
  settingsPage = SettingsPage;
  paramData = {
    userType: "tenant"
  };

  constructor(
    private fb: FirebaseProvider,
    public ui: UiProvider,
    private afDb: AngularFirestore,
    private navCtrl: NavController) {
    this.ui.showLoading();
    // TODO: melhorar tempo de loading, funcionou com 500ms (antes era 2000ms) e no ionViewCanEnter...
    setTimeout(() => { this.chooseRoot() }, 500);
  }

  public chooseRoot(): void {
    if (this.fb.user) {
      this.afDb.collection('ownerAccount').doc(this.fb.user.uid).snapshotChanges().subscribe(res => {

        if (res.payload.exists) {
          this.ui.closeLoading(true);
          console.log('usuário é owner.');
          this.navCtrl.setRoot(TabsPage);
        } else {
          this.ui.closeLoading();
        }
      });
    }
  }

  ionViewCanEnter() {
    // if (this.fb.user) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
}
