import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ModalController,
  ActionSheetController,
  AlertController
} from "ionic-angular";
import { TenantFormPage } from "./tenant-form/tenant-form";
import { TenantDetailsPage } from "./tenant-details/tenant-details";
import { Observable } from "rxjs/Observable";
import { TenantAccount } from "../../models/tenant-account";
import { UiProvider, FirebaseProvider } from "../../providers";
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/internal/operators/map';
import { ContractFormPage } from "../contract/contract-form/contract-form";
import { Contract } from "../../models/contract";
import { RealEstate } from "../../models/real-estate";

@Component({
  selector: "page-tenant",
  templateUrl: "tenant.html"
})
export class TenantPage {
  public evaluationNumber = 1;
  public overallScore = "4.8"
  public searchingTenants: boolean = false;
  public tenants: Observable<TenantAccount[]>;
  public tenantsExists: boolean = false;
  public searchString: string = '000.000.000-00'; // apenas para teste
  public contracts: Contract[];
  public realEstates: RealEstate[];

  constructor(
    private modalCtrl: ModalController,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore,
    public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider
  ) {
    this.search(); // apenas para teste
    this.getContracts();
    this.getRealEstates();
  }

  public getContracts() {
    this.afDb.collection<Contract>(
      'Contract',
      ref => ref.where('ownerId', '==', this.fb.user.uid)
        .where("active", "==", true)
        .where("status", "==", "detached")
    ).snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as Contract;
            const id = a.payload.doc.id;
            data.id = id;
            return { id, ...data };
          })
        )
      ).subscribe((data) => {
        if (data.length > 0) {
          this.contracts = data;
        } else {
          this.contracts = null;
        }
      });
  }

  public getRealEstates() {
    this.afDb.collection<RealEstate>(
      "RealEstate",
      ref => ref.where("ownerId", "==", this.fb.user.uid)
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
      ).subscribe((data) => {
        if (data.length > 0) {
          this.realEstates = data;
        } else {
          this.realEstates = null;
        }
      });
  }

  public showListener(): void {
    document.getElementById('searchbar').classList.add('keyboard-open');
  }

  public hideListener(): void {
    document.getElementById('searchbar').classList.remove('keyboard-open');
  }

  public ionViewDidEnter(): void {
    window.addEventListener('keyboardWillShow', this.showListener);
    window.addEventListener('keyboardDidHide', this.hideListener);
  }

  public ionViewDidLoad(): void {
    let searchbar = window.document.getElementById('searchbar');
    let tabs = window.document.getElementById('footer');

    if (tabs.getAttribute('tabsplacement') === "top") {
      searchbar.classList.add('bottom-0');
    } else {
      searchbar.classList.remove('bottom-0');
    }
  }

  public ionViewWillLeave(): void {
    window.removeEventListener('keyboardWillShow', this.showListener);
    window.removeEventListener('keyboardDidHide', this.hideListener);
  }

  public cancelSearch(): void {
    this.searchingTenants = false;
    this.tenantsExists = false;
    this.tenants = null;
  }

  public newContract(tenant): void {
    if (this.realEstates) {
      let modal = this.modalCtrl.create(ContractFormPage, { tenantObj: tenant });
      modal.present();
    } else {
      this.ui.showAlert("Atenção", "Por favor, cadastre um imóvel (na aba Imóveis) antes de adicionar um contrato.");
    }
  }

  public newTenant(): void {
    let modal = this.modalCtrl.create(TenantFormPage);
    modal.present();
  }

  public search(): void {
    if (this.searchString.length == 14) {
      //TODO: Quando ativar esta funcao, criar um loading na tela sem ser o do ui...
      this.tenants = this.afDb.collection<TenantAccount>(
        'tenantAccount',
        ref => ref.where("document", "==", this.searchString).where("active", "==", true)
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as TenantAccount;
          const id = a.payload.doc.id;
          data.id = id;
          this.searchingTenants = true;
          this.tenantsExists = true;

          return { id, ...data };
        }))
      );
    }
  }

  public selectContract(tenant: TenantAccount): void {
    if (this.contracts) {
      let alert = this.alertCtrl.create();
      alert.setTitle('Selecione o contrato');

      this.contracts.forEach(contract => {
        alert.addInput({
          type: 'radio',
          label: "Início:" + new Date(contract.beginDate).toLocaleDateString()
            + "\nTérmino: " + new Date(contract.endDate).toLocaleDateString(),
          value: contract.id,
          checked: false
        });

      });

      alert.addButton('Cancelar');
      alert.addButton({
        text: 'Confirmar',
        handler: (data: string) => {

          console.log(data)
          this.fb.updateDataFromCollection('Contract', { id: data, tenantId: tenant.id, status: "pending" })
        }
      });
      alert.present();
    } else {
      this.ui.showAlert("Atenção", "Nenhum contrato disponível! Por favor, cadastre um novo contrato.");
    }
  }

  public tenantOptions(tenant: TenantAccount): void {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Escolha uma opção',
      buttons: [
        {
          text: 'Ver detalhes',
          handler: () => {
            this.viewDetails(tenant);
          }
        }, {
          text: 'Vincular contrato existente',
          handler: () => {
            this.selectContract(tenant);
          }
        }, {
          text: 'Vincular novo contrato',
          handler: () => {
            this.newContract(tenant);
          }
        }, {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public viewDetails(tenant): void {
    this.navCtrl.push(TenantDetailsPage, { tenant: tenant });
  }
}
