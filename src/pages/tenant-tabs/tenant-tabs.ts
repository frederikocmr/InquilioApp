import { Component } from "@angular/core";

import { TimelinePage } from "../timeline/timeline";
import { SettingsPage } from "../settings/settings";
import { UiProvider, FirebaseProvider } from "../../providers";
import { AngularFirestore } from "@angular/fire/firestore";
import { TabsPage } from "../tabs/tabs";
import { NavController } from "ionic-angular";

@Component({
  templateUrl: "tenant-tabs.html"
})
export class TenantTabsPage {
  timelinePage = TimelinePage;
  settingsPage = SettingsPage;

  constructor(
    private fb: FirebaseProvider,
    public ui: UiProvider,
    private afDb: AngularFirestore,
    private navCtrl: NavController) {
    this.ui.showLoading();
    setTimeout(() => { this.chooseRoot() }, 2000);
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
