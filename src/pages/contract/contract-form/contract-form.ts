import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Contract } from "../../../models/contract";
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";
import { RealEstate } from "../../../models/real-estate";
import { FirebaseProvider } from "../../../providers";
import { AngularFirestore } from "@angular/fire/firestore";

@IonicPage()
@Component({
  selector: "page-contract-form",
  templateUrl: "contract-form.html"
})
export class ContractFormPage {
  contract: Contract = new Contract();
  monthShortNames: String[] = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez"
  ];
  realEstates: Observable<RealEstate[]> = null;
  today: Date = new Date();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {
    this.realEstates = this.afDb
      .collection<RealEstate>("RealEstate", ref =>
        ref.where("ownerId", "==", this.fb.user.uid)
      )
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as RealEstate;
            const id = a.payload.doc.id;
            data.id = id;
            return { id, ...data };
          })
        )
      );
  }

  calculateDuration() {}

  setMaxDate() {
    return this.today.getFullYear() + 20;
  }

  setMinDate() {
    return this.today.toISOString();
  }
}
