import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController } from "ionic-angular";
import { SettingsPage } from "../settings/settings";

@IonicPage()
@Component({
  selector: "page-main-menu",
  templateUrl: "main-menu.html"
})
export class MainMenuPage {
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad MainMenuPage");
  }

  openSettings() {
    let modal = this.modalCtrl.create(SettingsPage);
    modal.present();

    modal.onDidDismiss(data => {
      console.log("Saiu da SettingsPage");
    });
  }
}
