import { Component } from "@angular/core";
import { NavController, NavParams, ModalController } from "ionic-angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirebaseProvider } from "../../providers";
import { History } from "../../models/history";

@Component({
  selector: "page-timeline",
  templateUrl: "timeline.html"
})
export class TimelinePage {
  public backgroundClass: string;
  public cardColor: string;
  public iconColor: string;
  public textColor: string;
  public timeClass: string;
  public itemsData: History[];
  public userType: string;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {
    if (navParams.get('userType')) this.userType = navParams.get('userType');
    else this.userType = "owner";
    
    this.changeLayout(this.userType);

    this.afDb.doc<any>('History/' + this.fb.user.uid).valueChanges().subscribe(
      (data) => {
        if (data) {
          this.itemsData = data.HistoryArray.reverse();
        }
      });
  }

  // Changes the color of some elements depending on the type of user
  public changeLayout(user: string): void {
    if (user == "owner") {
      this.backgroundClass = "bg-owner-page";
      this.cardColor = "primary700";
      this.iconColor = "light";
      this.textColor = "light-text";
      this.timeClass = "";
    } else {
      this.backgroundClass = "bg-tenant-page";
      this.cardColor = "light";
      this.iconColor = "primary"
      this.textColor = "primary-text";
      this.timeClass = "primary-text";
    }
  }

  public getIconName(type: string): string {
    switch (type) {
      case 'ownerAccount':
        return 'custom-border-account-circle';
      case 'tenantAccount':
        return 'custom-border-users';
      case 'Contract':
        return 'custom-border-contract';
      case 'RealEstate':
        return 'custom-border-home';
      case 'EvaluationPending':
        return 'custom-border-star-border';
      case 'EvaluationDone':
        return 'custom-border-star-full';
      default:
        return 'custom-border-timeline';
    }
  }

}
