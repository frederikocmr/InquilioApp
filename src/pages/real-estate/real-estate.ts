import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  PopoverController
} from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { AngularFirestore } from '@angular/fire/firestore';
import { UiProvider, FirebaseProvider } from '../../providers';
import { RealEstateFormPage } from "../real-estate/real-estate-form/real-estate-form";
import { RealEstateDetailsPage } from "../real-estate/real-estate-details/real-estate-details";
import { RealEstate } from "../../models/real-estate";
import { ListOptionsComponent } from "../../components/list-options/list-options";

@Component({
  selector: "page-real-estate",
  templateUrl: "real-estate.html"
})
export class RealEstatePage {
  public realEstates: Observable<RealEstate[]>;
  public realEstatesExists: boolean = false;

  constructor(
    private popoverCtrl: PopoverController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public ui: UiProvider,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {
    this.ui.showLoading();
    this.realEstates = this.afDb.collection<RealEstate>(
      'RealEstate',
      ref => ref.where('ownerId', '==', this.fb.user.uid).where("active", "==", true)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as RealEstate;
        const id = a.payload.doc.id;
        data.id = id;

        this.realEstatesExists = true;

        this.ui.closeLoading(true);
        return { id, ...data };
      }))
    );
    // Subscribing and acessing methods - not necessary when using a view async.
    // this.realEstates.subscribe((data) => {
    //   if(data){
    //     this.realEstatesExists = true;
    //   } else {
    //     this.realEstatesExists = false;
    //   }
    // });

  }

  public presentPopover(myEvent): void {
    let popover = this.popoverCtrl.create(ListOptionsComponent, {type: 'realEstate'});
    popover.present({
      ev: myEvent
    });
  }

  public newRealEstate(): void {
    let modal = this.modalCtrl.create(RealEstateFormPage);
    modal.present();

    // modal.onDidDismiss(data => {
    //   console.log("Saiu da RealEstateFormPage");
    // });
  }

  public viewDetails(realEstateObj): void {
    this.navCtrl.push(RealEstateDetailsPage, { realEstateObj: realEstateObj });
    // let detailsModal = this.modalCtrl.create(RealEstateDetailsPage, {realEstateObj: realEstateObj});
    // detailsModal.present();
    // detailsModal.onDidDismiss(data => {});
  }
}
