import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
} from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { ContractDetailsPage } from "./contract-details/contract-details";
import { ContractFormPage } from "./contract-form/contract-form";
import { FirebaseProvider, UiProvider } from "../../providers";
import { Contract } from './../../models/contract';
import { RealEstate } from "../../models/real-estate";
// import { RealEstate } from "../../models/real-estate";

@Component({
  selector: "page-contract",
  templateUrl: "contract.html"
})
export class ContractPage {
  public contracts: Observable<Contract[]>;
  public contractsExists: boolean = false;
  // public currentRealEstate: RealEstate = null;
  public realEstates: Observable<RealEstate[]> = null;
  public realEstatesExists: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {
    this.ui.showLoading();
    this.contracts = this.afDb.collection<Contract>(
      'Contract',
      ref => ref.where('ownerId', '==', this.fb.user.uid).where("active", "==", true)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Contract;
        const id = a.payload.doc.id;
        data.id = id;

        this.ui.closeLoading(true);

        return { id, ...data };
      }))
    );

    this.contracts.subscribe((data) => {
      this.contractsExists = (data.length > 0 ? true : false);
    });

    this.realEstates = this.afDb
      .collection<RealEstate>("RealEstate", ref =>
        ref.where("ownerId", "==", this.fb.user.uid)
          .where("active", "==", true)
          .where("contractId", "==", null)
      ).snapshotChanges()
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

    this.realEstates.subscribe((data) => {
      this.realEstatesExists = (data.length > 0 ? true : false);
    });
  }

  public getDateString(date): string {
    return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  // TODO: Buscar nome do imóvel para exibi-lo no card
  // public getRealEstateNameById(id: string): string {
  //   this.realEstates.forEach(realEstate => {
  //     if (realEstate.id == id) {
  //       return realEstate.name;
  //     }
  //   });
  // }

  public getStatusColor(status): string {
    switch (status) {
      case "detached": return "secondary";
      case "rejected": return "danger";
      case "pending": return "secondary";
      case "confirmed": return "granted";
      case "ended": return "granted";
      case "revoked": return "danger";
      default: return "light";
    }
  }

  public getStatusPt(status): string {
    switch (status) {
      case "detached": return "Sem inquilino";
      case "rejected": return "Rejeitado";
      case "pending": return "Pendente";
      case "confirmed": return "Confirmado";
      case "ended": return "Encerrado";
      case "revoked": return "Rescindido";
      default: return "Sem status";
    }
  }

  public newContract(): void {
    if (this.realEstatesExists) {
      let modal = this.modalCtrl.create(ContractFormPage);
      modal.present();
    } else {
      this.ui.showAlert("Atenção", "Por favor, cadastre um imóvel (na aba Imóveis) antes de adicionar um contrato.");
    }
  }

  public viewDetails(contract): void {
    this.navCtrl.push(ContractDetailsPage, { contract: contract });
  }
}
