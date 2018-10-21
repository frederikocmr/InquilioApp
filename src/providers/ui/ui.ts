import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class UiProvider {

  constructor(public alertCtrl: AlertController) {}

  alertUi(title: string, message: string) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log('OK clicked');
          }
        }
      ]
    });
    confirm.present();
  }
}