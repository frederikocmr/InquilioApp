import { Injectable } from '@angular/core';
import { Alert, AlertController, Loading, LoadingController, ToastController, Toast } from 'ionic-angular';

@Injectable()
export class UiProvider {
  loading: Loading;
  toast: Toast;
  alert: Alert;

  constructor(
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }

  public showAlert(title: string, message: string): void {
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    this.alert.present();
  }

  public showConfirm(title: string, message: string): void {

    this.alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancela');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            console.log('Ok');
          }
        }
      ]
    });
    this.alert.present();
  }

  public showToast(message: string, seconds: number, position: string): void {
    this.toast = this.toastCtrl.create({
      message: message,
      duration: seconds * 1000,
      position: position
    });
    this.toast.present();
  }

  public showLoading(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando...',
      cssClass: 'custom-loading',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  // TODO: Verificar: removeView was not found
  public closeLoading(removeView?: boolean): void {

    if (!this.loading.onDidDismiss && removeView) {
      this.loading.dismiss().catch(() => {});
    } else if (!removeView) {
      this.loading.dismiss().catch(() => {});
    }
  }
}