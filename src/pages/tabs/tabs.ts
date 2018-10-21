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
}
