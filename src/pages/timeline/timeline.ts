import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-timeline",
  templateUrl: "timeline.html"
})
export class TimelinePage {
  items = [
    {
      title: 'Imóvel adicionado',
      content: 'Você adicionou um novo imóvel',
      icon: 'home',
      time: {subtitle: 'Quinta-feira', title: '01/11/2018'}
    }
  ]

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad TimelinePage");
  }

}
