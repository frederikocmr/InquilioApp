import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseProvider, UiProvider } from './../../../providers';
import { RealEstate } from '../../../models/real-estate';
import { Contract } from './../../../models/contract';
import { TenantAccount } from './../../../models/tenant-account';
import { RealEstateFormPage } from './../real-estate-form/real-estate-form';
import { ContractFormPage } from '../../contract/contract-form/contract-form';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'page-real-estate-details',
  templateUrl: 'real-estate-details.html',
})
export class RealEstateDetailsPage {
  public inquilino = false;
  public tenant: TenantAccount;
  public contract: Contract;
  public realEstate: RealEstate = new RealEstate();
  public realEstateType: String = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private afDb: AngularFirestore,
    private modalCtrl: ModalController,
    private fb: FirebaseProvider) {
      this.realEstate = navParams.get('realEstateObj');
      this.getRealEstateType();
      this.getContract();
  }

  public getContract(): void {
    this.afDb.collection<Contract>(
      'Contract',
      ref => ref.where('realEstateId', '==', this.realEstate.id)
      .where("active", "==", true)
    ).valueChanges().subscribe(data => {
      if(data.length > 0 ){
        this.contract = data[0] as Contract;
        if(this.contract.tenantId) {
          this.getTenant();
        }
      } 
    });
  }
  
  public getDateString(date): string {
    return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  public getTenant(): void {
    this.afDb.doc<TenantAccount>('tenantAccount/'+ this.contract.tenantId).valueChanges().subscribe(
      (data) => { 
        if(data){
          this.tenant = data as TenantAccount;
        }
      }
    );
  }

  public getRealEstateType(): string {
    switch (this.realEstate.type) {
      case 'a': return "Apartamento";
      case 'c': return "Casa";
      case 'k': return "Kitnet";
      case 'q': return "Quarto";
      case 'o': return "Outro";
      default: return "Outro";
    }
  }

  public newContract(): void {
    let modal = this.modalCtrl.create(ContractFormPage, { realEstateObj: this.realEstate });
    modal.present();
  }

  public onEditRealEstate(): void {
    let detailsModal = this.modalCtrl.create(RealEstateFormPage, { realEstateObj: this.realEstate });
    detailsModal.present();
  }

  public removeRealEstate(): void {
    let modal = this.ui.alertCtrl.create({
      title: "Remover Imóvel?",
      subTitle: "Essa ação é permanente e não pode ser desfeita.",
      buttons: ["Cancelar",
        {
          text: "Remover",
          handler: () => {
            this.fb.deactivateDataFromCollection('RealEstate', this.realEstate).then(() => {
              this.ui.showToast(this.fb.message, 2, 'top');
              if (this.fb.validator) {
                this.navCtrl.pop();
              }
            }).catch((error) => {
              this.ui.showAlert("Erro ao desativar", error);
            });
          }
        }]
    });

    modal.present();

  }

}
