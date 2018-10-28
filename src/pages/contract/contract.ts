import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { ContractDetailsPage } from "./contract-details/contract-details";
import { ContractFormPage } from "./contract-form/contract-form";
import { FirebaseProvider } from "../../providers";
import { Contract } from './../../models/contract';
import { RealEstate } from "../../models/real-estate";

@IonicPage()
@Component({
  selector: "page-contract",
  templateUrl: "contract.html"
})
export class ContractPage {
  public contracts: Observable<Contract[]>;
  public currentRealEstate: RealEstate = null;

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore
  ) {
    this.contracts = this.afDb.collection<Contract>(
      'Contract',
      ref => ref.where('ownerId', '==', this.fb.user.uid).where("active", "==", true)
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Contract;
        const id = a.payload.doc.id;

        this.afDb.doc<RealEstate>('RealEstate/' + data.realEstateId).valueChanges().
          subscribe((data) => {
            this.currentRealEstate = data;
            console.log(this.currentRealEstate);
          });
          // TODO: preciso consultar o realEstate depois que consulta o contrato pelo id que tá no contrato...
          // Será que se eu mudar para salvar o objeto realEstate dentro do contrato no Firestore ficaria legal?
          
        data.realEstate = this.currentRealEstate;
        data.id = id;
        return { id, ...data };
      }))
    );

  }

  // TODO: verificar se o usuário possui imóveis e inquilinos cadastrados, se sim entra na modal para criar um contrato, senão mostra um alert pedindo que cadastre o que falta.
  public newContract(): void {
    let modal = this.modalCtrl.create(ContractFormPage);
    modal.present();
  }

  public viewDetails(contract): void {
    this.navCtrl.push(ContractDetailsPage, { contract: contract });
    // let detailsModal = this.modalCtrl.create(ContractDetailsPage, {contract: contract});
    // detailsModal.present();   
    console.log(this.contracts);

  }
}
