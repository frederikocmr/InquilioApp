import { FirebaseProvider } from "./../../providers/firebase/firebase";
import { Component } from "@angular/core";

import { MyRealEstatePage } from "../my-real-estate/my-real-estate";
import { SettingsPage } from "../settings/settings";
import { MainMenuPage } from "../main-menu/main-menu";

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  mainMenuPage = MainMenuPage;
  myRealEstatePage = MyRealEstatePage;

  constructor(private fb: FirebaseProvider) {}

  ionViewCanEnter() {
    if (this.fb.user) {
      return true;
    } else {
      return false;
    }
  }
}
