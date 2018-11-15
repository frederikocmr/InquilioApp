import { Component } from "@angular/core";

import { TimelinePage } from "../timeline/timeline";
import { SettingsPage } from "../settings/settings";
import { UiProvider, FirebaseProvider } from "../../providers";
import { NavController } from "ionic-angular";
import { ContractDetailsPage } from "../contract/contract-details/contract-details";
import { Observable } from "rxjs/Observable";
import { AngularFireAuth } from "@angular/fire/auth";
import { WelcomePage } from "../welcome/welcome";

@Component({
  templateUrl: "tenant-tabs.html"
})
export class TenantTabsPage {
  public user: Observable<firebase.User>;
  public timelinePage = TimelinePage;
  public contractDetailsPage = ContractDetailsPage;
  public settingsPage = SettingsPage;
  public tabs;

  constructor(
    private fb: FirebaseProvider,
    public ui: UiProvider,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController) {
    this.user = this.afAuth.authState;
    this.user.subscribe((user) => {
      if (!user) {
        this.navCtrl.setRoot(WelcomePage);
      } else {
        this.fb.getUserData(user.uid, false);
      }
    });

    this.tabs = [
      {
        icon: 'custom-timeline', root: this.timelinePage, title: 'Atividades', type: 'timeline',
        userType: "tenant"
      },
      {
        icon: 'custom-contract', root: this.contractDetailsPage, title: 'Meu Contrato', type: 'settings',
        userType: "tenant"
      },
      {
        icon: 'custom-settings', root: this.settingsPage, title: 'Ajustes', type: 'settings',
        userType: "tenant"
      }
    ];
  }

  // public chooseRoot(): void {

  //   if (this.fb.user) {
  //     this.afDb.collection('ownerAccount').doc(this.fb.user.uid).snapshotChanges().subscribe(res => {

  //       if (res.payload.exists) {
  //         this.ui.closeLoading(true);
  //         this.navCtrl.setRoot(TabsPage);
  //       } else {
  //         this.ui.closeLoading();
  //       }
  //     });
  //   } else {
  //     this.ui.closeLoading();
  //   }
  // }

  ionViewCanEnter() {
    if (this.fb.user) {
      return true;
    } else {
      return false;
    }
  }
}
