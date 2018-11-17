import { TenantAccount } from './../../models/tenant-account';
import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavParams, PopoverController, ViewController, ModalController } from 'ionic-angular';
import { FirebaseProvider, UiProvider } from '../../providers';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notification } from "../../models/notification";
import { Contract } from '../../models/contract';
import { RealEstate } from '../../models/real-estate';
import { TenantEvaluationPage } from '../../pages/tenant/tenant-evaluation/tenant-evaluation';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'nav-options-component',
  template: `
    <ion-navbar color="primary">
      <ion-title>{{title}}</ion-title>
      <ion-buttons end>
        <button ion-button icon-only (click)="presentPopover($event, 'notification')">
          <ion-badge [hidden]="!notificationsNumber" color="danger">{{notificationsNumber}}</ion-badge>
          <ion-icon name="custom-notifications"></ion-icon>
        </button>
        <button [hidden]="type === 'settings'" ion-button icon-only (click)="presentPopover($event, type)">
          <ion-icon ios="custom-more-ios" md="custom-more-android"></ion-icon>
        </button>
      </ion-buttons>
    </ion-navbar>
  `
})
export class NavOptionsComponent {
  public notification: Notification[];
  public notificationsItems: any[];
  public notificationsNumber: number = 0;
  public title: string;
  public type: string;

  constructor(
    private popoverCtrl: PopoverController,
    private navParams: NavParams,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore) {
    if (this.navParams.get('title')) {
      this.title = this.navParams.get('title');
    }

    if (this.navParams.get('type')) {
      this.type = this.navParams.get('type');
    }

    this.getNotifications();

    // this.notificationsItems = [
    //   { action: {title: "Confirmar Contrato", id: "iohjoisaDS0w232309dsfoadfh", show: "contractConfirmation"}, datetime: new Date('2018-10-01T00:12').getTime(), type: 'contract' },
    //   { action: {title: "Rescindir Contrato", id: "iohjoisaDS0w2dfdfgdsfoadfh", show: "contractRevoke"}, datetime: new Date().getTime(), type: 'contract' }
    // ];


  }

  private getNotifications(): void {
    this.afDb.doc<any>('Notification/' + this.fb.user.uid).valueChanges().subscribe(
      (data) => {
        if (data) {
          this.notification = [];
          this.notificationsItems = [];

          let dataKeys = Object.keys(data);

          dataKeys.forEach(element => {
            this.notification.push(data[element]);
          });

          this.notification.sort(function (a, b) { return a.datetime - b.datetime }).reverse();

          this.notification.forEach(item => {
            if (item.action && item.active) {
              this.notificationsItems.push(item);
            }
          });

          this.notificationsNumber = this.notificationsItems.length;
        }
      });
  }

  public presentPopover(myEvent, itemType: string): void {
    let component;
    let params = { type: itemType };

    if (itemType === 'notification') {
      component = NotificationsComponent;
      params['notifications'] = this.notificationsItems;
    } else {
      component = FilterOrderComponent;
    }

    let popover = this.popoverCtrl.create(component, params);
    popover.present({
      ev: myEvent
    });
  }

}


@Component({
  template: `
    <ion-list class="notification-list">
      <ion-list-header class="text-color">Notificações</ion-list-header>
      <ion-item [hidden]="notifications">
        <h2 class="text-color">Sem notificações pendentes.</h2>
      </ion-item>
      <ion-item *ngFor="let item of notifications" ion-item no-margin (click)="notificationAction(item)">
        <h2 class="text-color">{{item.action.title}}</h2>
        <p class="text-color">{{ item.datetime | date:"dd/MM/yyyy \'às\' HH:mm" }}</p>
        <button clear ion-button item-end>VER</button>
      </ion-item>
    </ion-list>
  `
})

export class NotificationsComponent {
  public notifications: Notification[];
  public notification: Notification;
  private contract: Contract;
  private tenant: TenantAccount;
  public realEstate: RealEstate = null;

  constructor(
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private afDb: AngularFirestore,
    private fb: FirebaseProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public ui: UiProvider) {
    this.notifications = this.navParams.get('notifications');

  }

  public notificationAction(item): void {
    this.notification = item;
    if (this.notification.action.show == "contractConfirmation") {
      this.ui.showLoading();
      this.afDb.doc<Contract>('Contract/' + item.action.id).valueChanges()
        .subscribe((data) => {
          this.contract = data;
          this.contract.id = item.action.id;
          this.calculateDuration();

          this.afDb.doc<RealEstate>('RealEstate/' + this.contract.realEstateId).valueChanges().
            subscribe((data) => {
              this.realEstate = data;
              let message = '';
              message += "Início: " + (new Date(this.contract.beginDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })) + "\n";
              message += "Fim: " + (new Date(this.contract.endDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })) + "\n";
              message += "Duração: " + this.contract.duration + "\n\n";
              message += "Endereço do imóvel:\n" + this.realEstate.street + " - " + this.realEstate.district + "\n" + this.realEstate.city + " - " + this.realEstate.state;// + "\n";
              message = message.replace(/\n/g, "<br />");

              const alert = this.alertCtrl.create({
                title: item.action.title,
                message: message,
                buttons: [
                  { text: "Recusar", handler: () => { this.denyAction() } },
                  { text: "Confirmar", handler: () => { this.confirmAction() } }
                ]
              });
              this.ui.closeLoading();
              this.viewCtrl.dismiss();
              alert.present();
            });
        });
    } else if (this.notification.action.show == "tenantEvaluation"){

      const alert = this.alertCtrl.create({
        title: "Deseja ir para a tela de avaliação?",
        message: "Após confirmar, a avaliação deverá ser feita.",
        buttons: [
          { text: "Agora não", role: 'cancel'  },
          { text: "Avaliar", handler: () => { this.tenantEvaluationAction(item) } }
        ]
      });
      alert.present();
    }
  }

  public tenantEvaluationAction(item: any): void {
    this.ui.showLoading();
    this.afDb.doc<TenantAccount>('tenantAccount/' + item.action.id).valueChanges()
    .subscribe((data) => {
      data.id = item.action.id;
      this.tenant = data;

      this.afDb.collection<Contract>(
        'Contract',
        ref => ref.where('tenantId', '==', this.tenant.id)
        .where("active", "==", true)
        .where("status", "==", "confirmed")
        .where("ownerId", "==", this.fb.user.uid)
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
      ).subscribe(data => {
        if(data){
          this.contract = data[0] as Contract;
        } 
        this.ui.closeLoading();
        this.evaluateTenant();
      }); 
    });
  }

  public evaluateTenant(): void {
    // TODO: mandar outro argumento para dar clearNotification após avaliação feita... 
    // Para o cara poder voltar a tela sem ter avaliado... 
    let modal = this.modalCtrl.create(TenantEvaluationPage, { tenantObj: this.tenant, contractObj: this.contract  });
    modal.present();
    //this.clearNotification();
  }

  public denyAction(): void {
    if (this.notification.action.show == "contractConfirmation") {
      this.contract.status = "rejected";
      this.fb.updateDataFromCollection("Contract", this.contract);
      this.ui.showToast("O contrato foi recusado. Para mais informações, visite suas atividades.", 4, 'top');
    }
    this.clearNotification();
  }

  public confirmAction(): void {
    if (this.notification.action.show == "contractConfirmation") {
      this.contract.status = "confirmed";
      this.fb.updateDataFromCollection("Contract", this.contract);
      this.ui.showToast("O contrato foi confirmado e será inserido na aba 'Meu Contrato'", 4, 'top');
    }

    this.clearNotification();
  }

  private clearNotification(): void{

    let json = `{"${this.notification.datetime}":{
      "active": false,
      "datetime": ${this.notification.datetime},
      "type": "Contract"
  }}`;
   let updateData = JSON.parse(json);

    this.afDb.collection("Notification").doc(this.fb.user.uid).update(updateData);
  }

  public calculateDuration(): void {
    let beginDate = this.contract.beginDate;
    let endDate = this.contract.endDate;
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

}


@Component({
  template: `
		<div class="list-options">
			<ion-list>
				<ion-list-header class="text-color">Opções</ion-list-header>
				<button ion-item (click)="filterOptions()">Filtrar</button>		
				<button ion-item (click)="orderOptions()">Ordenar</button>		
			</ion-list>
		</div>
  `
})
export class FilterOrderComponent {
  public items: object[];

  constructor(private actionSheetCtrl: ActionSheetController, public viewCtrl: ViewController, public navParams: NavParams) {
    this.items = this.getFilterButtons(navParams.get('type'));
  }

  private getFilterButtons(type) {
    let buttons = [];
    let texts = [];

    switch (type) {
      case 'contract':
        texts = ["Apenas contratos ativos", "Apenas contratos encerrados", "Todos os contratos"];
        break;
      case 'realEstate':
        texts = ["Apenas imóveis alugados", "Apenas imóveis sem contrato", "Todos os imóveis"];
        break;
      case 'tenants':
        texts = ["Apenas inquilinos atuais", "Apenas inquilinos antigos", "Todos os inquilinos"];
        break;
      case 'timeline':
        texts = ["Apenas contratos", "Apenas imóveis", "Apenas inquilinos", "Todos"];
        break;
    }

    texts.forEach(text => {
      let obj = {};
      obj['text'] = text;
      obj['handler'] = () => {
        console.log("Filtrar por ", text);
        this.viewCtrl.dismiss();
      }
      buttons.push(obj);
    });

    let cancel = { text: 'Cancelar', role: 'cancel' };
    buttons.push(cancel);

    return buttons;
  }

  public filterOptions(): void {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Filtrar por',
      buttons: this.items
    });

    this.viewCtrl.dismiss();
    actionSheet.present();
  }

  public orderOptions(): void {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Ordenar por',
      buttons: [
        {
          text: 'Nome (A a Z)',
          handler: () => {
            console.log("Ordenar por ", 'Nome (A a Z)');
            this.viewCtrl.dismiss();
          }
        }, {
          text: 'Nome (Z a A)',
          handler: () => {
            console.log("Ordenar por ", 'Nome (Z a A)');
            this.viewCtrl.dismiss();
          }
        }, {
          text: 'Data (mais recente primeiro)',
          handler: () => {
            console.log("Ordenar por ", 'Data (mais recente primeiro)');
            this.viewCtrl.dismiss();
          }
        }, {
          text: 'Data (mais antigo primeiro)',
          handler: () => {
            console.log("Ordenar por ", 'Data (mais antigo primeiro)');
            this.viewCtrl.dismiss();
          }
        }, {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    this.viewCtrl.dismiss();
    actionSheet.present();
  }
}
