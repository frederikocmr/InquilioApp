import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AngularFirestore } from "@angular/fire/firestore";
import { Contract } from '../../../models/contract';
import { FirebaseProvider } from '../../../providers';
import { UiProvider } from './../../../providers';
import { RealEstate } from '../../../models/real-estate';
import { ContractFormPage } from '../contract-form/contract-form';
import { TenantAccount } from '../../../models/tenant-account';

@Component({
  selector: 'page-contract-details',
  templateUrl: 'contract-details.html',
})
export class ContractDetailsPage {
  public backgroundClass: string;
  public iconColor: string;
  public itemColor: string;
  public textClass: string;
  public contract: Contract = new Contract();
  public contractExists: boolean = false;
  public currentRealEstate: RealEstate = null;
  public currentTenant: TenantAccount = null;
  public userType: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private modalCtrl: ModalController,
    private afDb: AngularFirestore,
    private fb: FirebaseProvider
  ) {
    if (navParams.get('contract')) {
      this.contract = navParams.get('contract');
      this.contractExists = true;

      this.afDb.doc<RealEstate>('RealEstate/' + this.contract.realEstateId).valueChanges().
        subscribe((data) => {
          this.currentRealEstate = data;
          console.log(this.currentRealEstate);
        });
    }

    if (navParams.get('userType')) this.userType = navParams.get('userType');
    else this.userType = "owner";
    this.changeLayout();
  }

  // Changes the color of some elements depending on the type of user
  private changeLayout(): void {
    if (this.userType === "owner") {
      this.backgroundClass = "bg-owner-page";
      this.iconColor = "secondary";
      this.itemColor = "secondary"
      this.textClass = "light-text";
    } else {
      this.backgroundClass = "bg-tenant-page";
      this.iconColor = "primary";
      this.itemColor = "dark";
      this.textClass = "primary-text";
    }
  }

  public getDateString(date): string {
    return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  public getRealEstateType(): string {
    switch (this.currentRealEstate.type) {
      case 'a': return "Apartamento";
      case 'c': return "Casa";
      case 'k': return "Kitnet";
      case 'q': return "Quarto";
      case 'o': return "Outro";
      default: return "Outro";
    }
  }

  public isContractActive(): boolean {
    let today = + new Date();
    if (today >= this.contract.beginDate && today <= this.contract.endDate) {
      return true;
    } else {
      return false;
    }
  }

  public isContractTerminated(): boolean {    
    let today = + new Date();
    if (today > this.contract.endDate) {
      return true;
    } else {
      return false;
    }
  }

  public onEditContract(): void {
    let detailsModal = this.modalCtrl.create(ContractFormPage, { contract: this.contract });
    detailsModal.present();
  }

  public removeContract(): void {
    let modal = this.ui.alertCtrl.create({
      title: "Remover Contrato?",
      subTitle: "Essa ação é permanente e não pode ser desfeita.",
      buttons: ["Cancelar",
        {
          text: "Remover",
          handler: () => {
            this.fb.deactivateDataFromCollection('Contract', this.contract).then(() => {
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

  // TODO: Finalizar método de renovação de contrato
  public renewContract(): void {
    this.navCtrl.push(ContractFormPage);
  }

  // TODO: Verificar se há inquilino vinculado ao contrato, se existir, enviar solicitação, senão, aceitar a solicitação imediatamente
  public revokeContract(): void {
    let modal = this.ui.alertCtrl.create({
      title: "Solicitar rescisão de contrato?",
      subTitle: "Essa ação enviará uma solicitação de rescisão do contrato ao inquilino associado.",
      buttons: ["Cancelar",
        {
          text: "Enviar",
          handler: () => {
            console.log('solicitação de rescisão enviada')
          }
        }]
    });

    modal.present();    
  }

  // TODO: Verificar se há inquilino vinculado ao contrato, se existir, enviar solicitação, senão, aceitar a solicitação imediatamente
  public deactivateContract(): void {
    let modal = this.ui.alertCtrl.create({
      title: "Solicitar desativação do contrato?",
      subTitle: "Uma solicitação de desativação do contrato será enviada ao inquilino associado para confirmar que ambos estão cientes da ação.",
      buttons: ["Cancelar",
        {
          text: "Enviar",
          handler: () => {
            console.log('contrato desativado')
          }
        }]
    });

    modal.present();  
  }
}
