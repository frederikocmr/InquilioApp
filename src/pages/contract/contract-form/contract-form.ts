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

  calculateDuration() {
    if(this.contract.endDate && this.contract.beginDate){ 
      let timestamp = new Date(this.contract.endDate).getTime() - new Date(this.contract.beginDate).getTime();
      let seconds = Math.floor((timestamp)/1000);
      let minutes = Math.floor(seconds/60);
      let hours = Math.floor(minutes/60);
      let days = Math.floor(hours/24);
      this.contract.duration = this.convertToString(days);
    } else {
      this.contract.duration = '';
    }
  }

  convertToString(days) {
    let y = 365;
    let y2 = 31;
    let remainder = days % y;
    let day = remainder % y2;
    let year = (days - remainder) / y;
    let month = (remainder - day) / y2;

    var result = 
    (year > 1 ? year + " anos, " : (year == 1 ?  year + " ano" + (month ? ' , ' : (day ? ' e ' : ' ')) :''))  +
    (month > 1 ? month + " meses " + (day && year ? 'e ' : (day ? 'e ' : '')) : (month == 1 ?  month + " mês " + (day ? 'e ' : '') : '')) + 
    (day > 1 ? day + " dias" : (day == 1 ?  day + " dia" :''));

    
    return result;
  }

  setMaxDate() {
    return this.today.getFullYear() + 20;
  }

  setMinDate() {
    return this.today.toISOString();
  }
}
