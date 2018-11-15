import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { FirebaseProvider, UiProvider } from '../../providers';
import { AngularFirestore } from '@angular/fire/firestore';
import { History } from "../../models/history";

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
  public history: History[];
  public notificationsItems: object[];
  public notificationsNumber: number = 0;
  public title: string;
  public type: string;

  constructor(private popoverCtrl: PopoverController, private navParams: NavParams,
    private fb: FirebaseProvider,
    private afDb: AngularFirestore, private ui: UiProvider) {
    if (this.navParams.get('title')) {
      this.title = this.navParams.get('title');
    }

    if (this.navParams.get('type')) {
      this.type = this.navParams.get('type');
    }
    
    // TODO: Importar os dados das ações aqui
    // this.afDb.doc<any>('History/' + this.fb.user.uid).valueChanges().subscribe(
    //   (data) => {
    //     if (data) {
    //       this.history = [];
    //       let dataKeys = Object.keys(data);

    //       dataKeys.forEach(element => {
    //         this.history.push(data[element]);
    //       });

    //       this.history.sort(function(a, b) {return a.datetime - b.datetime}).reverse();

    //       this.history.forEach(item => {
    //         if (item.action) {
    //           this.notificationsItems.push(item);
    //         }
    //       });
    //     }
    //   });

    this.notificationsItems = [
      { action: {title: "Confirmar Contrato", id: "iohjoisaDS0w232309dsfoadfh", show: "contractConfirmation"}, datetime: new Date('2018-10-01T00:12').getTime(), type: 'contract' },
      { action: {title: "Rescindir Contrato", id: "iohjoisaDS0w2dfdfgdsfoadfh", show: "contractRevoke"}, datetime: new Date().getTime(), type: 'contract' }
    ];

    this.notificationsNumber = this.notificationsItems.length;
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
      <ion-item *ngFor="let item of notifications" ion-item no-margin (click)="notificationAction(item)">
        <h2 class="text-color">{{item.action.title}}</h2>
        <p class="text-color">{{ item.datetime | date:"dd/MM/yyyy \'às\' HH:mm" }}</p>
        <button clear ion-button item-end>VER</button>
      </ion-item>
    </ion-list>
  `
})

export class NotificationsComponent {
  public notifications: object[];

  constructor(private alertCtrl: AlertController, public viewCtrl: ViewController, public navParams: NavParams) {
    this.notifications = this.navParams.get('notifications');
  }

  public notificationAction(item): void {
    let message = '';
    message += "Data de início: " + "15/11/2018" + "\n";
    message += "Data de fim: " + "15/11/2019" + "\n";
    message += "Duração: " + "1 ano" + "\n";
    message += "Endereço do imóvel: Rua Teste Estático \n";
    message = message.replace(/\n/g, "<br />");

    const alert = this.alertCtrl.create({
      title: item.action.title,
      message: message,
      buttons: [
        { text: "Recusar", handler: () => { console.log('Recusou') } },
        { text: "Confirmar", handler: () => { console.log('Confirmou') } }
      ]
    });

    this.viewCtrl.dismiss();
    alert.present();
  }

}


@Component({
  template: `
		<div class="list-options">
			<ion-list>
				<ion-list-header>Opções</ion-list-header>
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
