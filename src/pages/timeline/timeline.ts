import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ModalController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { UiProvider, FirebaseProvider } from "../../providers";
import { History } from "../../models/history";

@IonicPage()
@Component({
  selector: "page-timeline",
  templateUrl: "timeline.html"
})
export class TimelinePage {
  items: Observable<any>;
  itemsData: History[];

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {

    this.items = this.afDb.doc<any>('History/' +this.fb.user.uid).valueChanges();

    this.items.subscribe(
      (data) => {
        this.itemsData = data;
        console.log(data);
      }
    )
    
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TimelinePage");
  }

}
