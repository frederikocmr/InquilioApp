import { FirebaseProvider } from "./../../providers/firebase/firebase";
import { Component } from "@angular/core";

import { RealEstatePage } from "../real-estate/real-estate";
import { TimelinePage } from "../timeline/timeline";
import { ContractPage } from "../contract/contract";
import { TenantPage } from "../tenant/tenant";
import { SettingsPage } from "../settings/settings";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  contractPage = ContractPage;
  timelinePage = TimelinePage;
  realEstatePage = RealEstatePage;
  tenantPage = TenantPage;
  settingsPage = SettingsPage;

  constructor(private fb: FirebaseProvider) {}

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
