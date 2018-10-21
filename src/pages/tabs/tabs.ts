import { FirebaseProvider } from "./../../providers/firebase/firebase";
import { Component } from "@angular/core";

import { MyRealEstatePage } from "../my-real-estate/my-real-estate";
import { SettingsPage } from "../settings/settings";
import { MainMenuPage } from "../main-menu/main-menu";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root = MainMenuPage;
  tab2Root = MyRealEstatePage;
  tab3Root = SettingsPage;

  constructor(private fb: FirebaseProvider) {}

  ionViewCanEnter() {
    if (this.fb.user) {
      return true;
    } else {
      return false;
    }
  }
}
