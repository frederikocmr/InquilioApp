import { NavController } from "ionic-angular";
import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from "rxjs/Observable";
import { FirebaseProvider } from "./../../providers";

import { RealEstatePage } from "../real-estate/real-estate";
import { TimelinePage } from "../timeline/timeline";
import { ContractPage } from "../contract/contract";
import { TenantPage } from "../tenant/tenant";
import { SettingsPage } from "../settings/settings";
import { WelcomePage } from "../welcome/welcome";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  public user: Observable<firebase.User>;
  public contractPage = ContractPage;
  public timelinePage = TimelinePage;
  public realEstatePage = RealEstatePage;
  public tenantPage = TenantPage;
  public settingsPage = SettingsPage;
  public tabs;

  constructor(
    private fb: FirebaseProvider,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController) {
    this.user = this.afAuth.authState;
    this.user.subscribe((user) => {
      if(!user){
        this.navCtrl.setRoot(WelcomePage);
      } else {
        this.fb.getUserData(user.uid, false);
      } 
    });
    this.tabs = [
      {icon: 'custom-timeline', root: this.timelinePage, title: 'Atividades', type: 'timeline'},
      {icon: 'custom-contract', root: this.contractPage, title: 'Contratos', type: 'contract'},
      {icon: 'custom-home', root: this.realEstatePage, title: 'Imóveis', type: 'realEstate'},
      {icon: 'custom-users', root: this.tenantPage, title: 'Inquilinos', type: 'tenants'},
      {icon: 'custom-settings', root: this.settingsPage, title: 'Ajustes', type: 'settings'}
    ];
  }


  ionViewCanEnter() {
    if (this.fb.user) {
      return true;
    } else {
      return false;
    }
  }
	
  showListener() {
    document.getElementById('footer').classList.add('keyboard-is-open');
	}
	
  hideListener() {
    document.getElementById('footer').classList.remove('keyboard-is-open');
  }

  ionViewDidEnter() {
    window.addEventListener('keyboardWillShow', this.showListener);
    window.addEventListener('keyboardDidHide', this.hideListener);
  }

  ionViewWillLeave() {
    window.removeEventListener('keyboardWillShow', this.showListener);
    window.removeEventListener('keyboardDidHide', this.hideListener);
  }
}
