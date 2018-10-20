import { Component } from "@angular/core";
import { NavController } from "ionic-angular";

import { Tab1Root, Tab2Root, Tab3Root } from '../';

@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;

  tab1Title = " ";
  tab2Title = " ";
  tab3Title = " ";

  constructor(public navCtrl: NavController) {}
}
