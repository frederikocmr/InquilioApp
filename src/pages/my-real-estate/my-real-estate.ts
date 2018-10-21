import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { RealEstateFormPage } from "../real-estate-form/real-estate-form";
import { RealEstateDetailsPage } from "../real-estate-details/real-estate-details";

@IonicPage()
@Component({
  selector: "page-my-real-estate",
  templateUrl: "my-real-estate.html"
})
export class MyRealEstatePage {
  realEstates = [
    { name: "", description: "", link: "", img: "" },
    { name: "", description: "", link: "", img: "" }
  ];
  realEstateFormPage = RealEstateFormPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController
  ) {
    this.realEstates.forEach(realEstate => {
      realEstate.name = "Imóvel teste 1";
      realEstate.description = "Descrição de teste do imóvel 1.";
      realEstate.link = "imovel.com.br";
      realEstate.img = "../assets/imgs/placeholder.jpg";
    });
  }

  viewDetails() {
    let detailsModal = this.modalCtrl.create(RealEstateDetailsPage);
    detailsModal.present();

    detailsModal.onDidDismiss(data => {
      console.log(data);
    });
  }
}
