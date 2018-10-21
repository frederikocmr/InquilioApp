import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";

import { AngularFirestore } from '@angular/fire/firestore';
import { RealEstateFormPage } from "../real-estate/real-estate-form/real-estate-form";
import { RealEstateDetailsPage } from "../real-estate/real-estate-details/real-estate-details";
import { RealEstate } from "../../models/real-estate";
import { Observable } from "rxjs/Observable";

@IonicPage()
@Component({
  selector: "page-real-estate",
  templateUrl: "real-estate.html"
})
export class RealEstatePage {
  realEstates: RealEstate[];
  items: Observable<RealEstate[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {
    this.items = this.afDb.collection<RealEstate>(
      'RealEstate',
      ref => ref.where('ownerId', '==', this.fb.user.uid)
    ).valueChanges();

    this.items.subscribe((data) => {
      this.realEstates = data
    });

  }

  newRealEstate() {
    let modal = this.modalCtrl.create(RealEstateFormPage);
    modal.present();

    modal.onDidDismiss(data => {
      console.log("Saiu da RealEstateFormPage");
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
