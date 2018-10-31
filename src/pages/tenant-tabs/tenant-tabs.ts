import { FirebaseProvider } from "./../../providers/firebase/firebase";
import { Component } from "@angular/core";

import { TimelinePage } from "../timeline/timeline";
import { SettingsPage } from "../settings/settings";

@Component({
  templateUrl: "tenant-tabs.html"
})
export class TenantTabsPage {
  timelinePage = TimelinePage;
  settingsPage = SettingsPage;

  constructor(private fb: FirebaseProvider) {}

  ionViewCanEnter() {
    // if (this.fb.user) {
    //   return true;
    // } else {
    //   return false;
    // }
  }
}
