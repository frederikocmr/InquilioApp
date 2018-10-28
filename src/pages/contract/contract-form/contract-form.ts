import { TenantAccount } from './../../../models/tenant-account';
import { UiProvider } from './../../../providers/ui/ui';
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
  public contract: Contract = new Contract();
  public monthShortNames: String[] = [
    "jan","fev","mar","abr","mai","jun",
    "jul","ago","set","out","nov","dez"
  ];
  public realEstates: Observable<RealEstate[]> = null;
  public tenants: Observable<TenantAccount[]> = null;
  public today: Date = new Date();
  public editing: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
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

  public calculateDuration(): void {
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

  public convertToString(days): string {
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

  public setMaxDate(): number {
    return this.today.getFullYear() + 20;
  }

  public setMinDate(): string {
    return this.today.toISOString();
  }

  public addContract(): void {
    this.ui.showLoading();
    if(!this.editing){
      this.contract.ownerId = this.fb.user.uid;
      this.fb.insertDataToCollection('Contract', this.contract).then(() => {
        this.ui.closeLoading();
        this.ui.showToast(this.fb.message, 2, 'top');
  
        if (this.fb.validator) {
          this.navCtrl.pop();
        }
      }).catch((error) => {
        this.ui.closeLoading();
        this.ui.showAlert("Erro ao cadastrar", error);
      });
    } else {

      this.fb.updateDataFromCollection('Contract', this.contract).then(() => {
        this.ui.closeLoading();
        this.ui.showToast(this.fb.message, 2, 'top');
  
        if (this.fb.validator) {
          this.navCtrl.pop();
        }
      }).catch((error) => {
        this.ui.closeLoading();
        this.ui.showAlert("Erro ao editar", error);
      });

    }
    
  }
}
