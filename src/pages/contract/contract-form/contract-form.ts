import { TenantAccount } from "./../../../models/tenant-account";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Contract } from "../../../models/contract";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { FirebaseProvider, UiProvider } from "../../../providers";
import { RealEstate } from "../../../models/real-estate";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@IonicPage()
@Component({
  selector: "page-contract-form",
  templateUrl: "contract-form.html"
})
export class ContractFormPage {
  public contract: Contract = new Contract();
  contractForm: FormGroup;
  public monthShortNames: String[] = [
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
  public realEstates: Observable<RealEstate[]> = null;
  public tenants: Observable<TenantAccount[]> = null;
  public today: Date = new Date();
  public editing: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {
    if (this.navParams.get("contract")) {
      this.contract = navParams.get("contract");
      this.editing = true;
    }

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

    this.contractForm = this.formBuilder.group({
      beginDate: [this.contract.beginDate ? this.contract.beginDate : "", Validators.required],
      endDate: [this.contract.endDate ? this.contract.endDate : "", Validators.required],
      duration: [this.contract.duration ? this.contract.duration : "", Validators.required],
      realEstateId: [this.contract.realEstateId ? this.contract.realEstateId : "", Validators.required],
      tenantId: [this.contract.tenantId ? this.contract.tenantId : ""]
    });
  }

  public calculateDuration(): void {
    let beginDate = this.contractForm.value.beginDate;
    let endDate = this.contractForm.value.endDate;
    if (endDate && beginDate) {
      let timestamp =
        new Date(endDate).getTime() -
        new Date(beginDate).getTime();
      let seconds = Math.floor(timestamp / 1000);
      let minutes = Math.floor(seconds / 60);
      let hours = Math.floor(minutes / 60);
      let days = Math.floor(hours / 24);
      this.contract.duration = this.convertToString(days);
    } else {
      this.contract.duration = "";
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
      (year > 1
        ? year + " anos, "
        : year == 1
          ? year + " ano" + (month ? " , " : day ? " e " : " ")
          : "") +
      (month > 1
        ? month + " meses " + (day && year ? "e " : day ? "e " : "")
        : month == 1
          ? month + " mês " + (day ? "e " : "")
          : "") +
      (day > 1 ? day + " dias" : day == 1 ? day + " dia" : "");

    return result;
  }

  public setMaxDate(): number {
    return this.today.getFullYear() + 20;
  }

  public setMinDate(): string {
    return this.today.toISOString();
  }
	
	public getValuesFromForm() {
		let newObject = this.contractForm.value as Contract;
		this.contract.beginDate = newObject.beginDate;
		this.contract.endDate = newObject.endDate;
		this.contract.duration = newObject.duration;
		this.contract.realEstateId = newObject.realEstateId;
		this.contract.tenantId = newObject.tenantId;
	}

  public addContract(): void {
    this.ui.showLoading();
    this.getValuesFromForm();
    if (!this.editing) {
      this.contract.ownerId = this.fb.user.uid;
      this.fb
        .insertDataToCollection("Contract", this.contract)
        .then(() => {
          this.ui.closeLoading();
          this.ui.showToast(this.fb.message, 2, "top");

          if (this.fb.validator) {
            this.navCtrl.pop();
          }
        })
        .catch(error => {
          this.ui.closeLoading();
          this.ui.showAlert("Erro ao cadastrar", error);
        });
    } else {
      this.fb
        .updateDataFromCollection("Contract", this.contract)
        .then(() => {
          this.ui.closeLoading();
          this.ui.showToast(this.fb.message, 2, "top");

          if (this.fb.validator) {
            this.navCtrl.pop();
          }
        })
        .catch(error => {
          this.ui.closeLoading();
          this.ui.showAlert("Erro ao editar", error);
        });
    }
  }
}
