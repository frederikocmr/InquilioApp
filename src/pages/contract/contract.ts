import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";
import { Contract } from './../../models/contract';
import { ContractDetailsPage } from "./contract-details/contract-details";
import { ContractFormPage } from "./contract-form/contract-form";

@IonicPage()
@Component({
  selector: "page-contract",
  templateUrl: "contract.html"
})
export class ContractPage {
  contracts: Contract = null;

  constructor(
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad ContractPage");
  }

  // TODO: verificar se o usuário possui imóveis e inquilinos cadastrados, se sim entra na modal para criar um contrato, senão mostra um alert pedindo que cadastre o que falta.
  newContract() {
    let modal = this.modalCtrl.create(ContractFormPage);
    modal.present();
  }

  viewDetails(contract){
    let detailsModal = this.modalCtrl.create(ContractDetailsPage, {contract: contract});
    detailsModal.present();    
  }
}
