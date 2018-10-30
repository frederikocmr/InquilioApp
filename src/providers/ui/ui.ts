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

  public showToast(message: string, seconds: number, position: string): void {
    this.toast = this.toastCtrl.create({
      message: message,
      duration: seconds*1000,
      position: position
    });
    this.toast.present();
  }

  public showLoading(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  public closeLoading(): void {
    if (!this.loading.onDidDismiss){
      this.loading.dismiss();
    }
  }
}