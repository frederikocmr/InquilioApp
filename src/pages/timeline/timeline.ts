import { Component } from "@angular/core";
import { NavController, NavParams, ModalController } from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { map, withLatestFrom } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { UiProvider, FirebaseProvider } from "../../providers";
import { History } from "../../models/history";
import { async } from "rxjs/internal/scheduler/async";

@Component({
  selector: "page-timeline",
  templateUrl: "timeline.html"
})
export class TimelinePage {
  backgroundClass: string;
  cardColor: string;
  iconColor: string;
  textColor: string;
  items: Observable<any>;
  itemsData: History[];
  userType: string;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {

    this.items = this.afDb.doc<any>('History/' + this.fb.user.uid).valueChanges();

    this.items.subscribe(
      (data) => {
        this.itemsData = data;
        console.log(data);
      }
    )

    if (navParams.get('userType')) this.userType = navParams.get('userType');
    else this.userType = "owner";

  }

  ionViewDidEnter() {
    this.changeLayout(this.userType);
  }

  // Changes the color of some elements depending on the type of user
  changeLayout(user: string) {
    if (user == "owner") {
      this.backgroundClass = "bg-owner-page";
      this.cardColor = "primary700";
      this.iconColor = "light";
      this.textColor = "light-text";
    } else {
      this.backgroundClass = "bg-tenant-page";
      this.cardColor = "light";
      this.iconColor = "primary"
      this.textColor = "primary-text";
      this.changeTimeColor();
    }
  }

  // Add the class "primary-text" to all span elements inside timeline-time to change
  // the color of the text to primary
  changeTimeColor() {
    let timelineTime = document.getElementsByTagName("timeline-time");
    let length = timelineTime.length;
    for (let i = 0; i < length; i++) {
      let el = timelineTime[i].children;
      let spanLength = el.length;
      for (let j = 0; j < spanLength; j++) {
        el[j].className = "primary-text";
      }
    }
  }

}
