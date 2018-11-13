import { Component } from '@angular/core';
import { ActionSheetController, AlertController, NavParams, PopoverController, ViewController } from 'ionic-angular';

@Component({
  selector: 'nav-options-component',
  template: `
    <ion-toolbar color="primary">
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
    </ion-toolbar>
  `
})
export class NavOptionsComponent {
  public notificationsItems: object[];
  public notificationsNumber: number = 0;
  public title: string;
  public type: string;

  constructor(private popoverCtrl: PopoverController, private navParams: NavParams) {
    if (this.navParams.get('title')) {
      this.title = this.navParams.get('title');
    }

    if (this.navParams.get('type')) {
      this.type = this.navParams.get('type');
    }
    
    // TODO: Importar os dados das ações aqui
    this.notificationsItems = [
      { title: "Confirmar contrato", datetime: new Date('2018-10-01T00:12').getTime() },
      { title: "Rescindir contrato", datetime: new Date().getTime() }
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
      <ion-item *ngFor="let item of notifications" ion-item no-margin (click)="notificationAction(item.title)">
        <h2 class="text-color">{{item.title}}</h2>
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
    const alert = this.alertCtrl.create({
      title: item,
      message: 'Testando alert',
      buttons: [
        { text: 'Cancelar', handler: () => { console.log('Cancelou') } },
        { text: item.substring(0, item.indexOf(' ')), handler: () => { console.log('Confirmou') } }
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
