import { Component } from '@angular/core';

import { SignupPage } from '../signup/signup';
import { FirebaseProvider } from '../../providers';
import { ToastController, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  signupPage = SignupPage;
  registerCredentials = { email: '', password: '' };
  email: string = "";
  password: string = "";

  constructor(private alertCtrl: AlertController,
              private firebase: FirebaseProvider,
              private loadingCtrl: LoadingController,
              private navCtrl: NavController,
              private toastCtrl: ToastController){}

  public createAccount() {
    this.navCtrl.push(SignupPage);
  }

  doLoginWithGoogle() {
    this.showLoading();
    this.firebase.signInWithGoogle().then(() => {
			let toast = this.toastCtrl.create({
				message: this.firebase.message,
				duration: 3000,
				position: 'top'
			});
      toast.present();
      this.loading.dismiss();

			if(this.firebase.validator) {
        this.navCtrl.setRoot(TabsPage);
      }
      
    }).catch((error) => {
      this.showError(error);
    });
  }

  doLoginWithEmail() {
    this.firebase.signIn(this.registerCredentials.email, this.registerCredentials.password).then(() => {
			let toast = this.toastCtrl.create({
				message: this.firebase.message,
				duration: 3000,
				position: 'top'
			});
      toast.present();

			if(this.firebase.validator) {
        this.navCtrl.setRoot(TabsPage);
      }
      
    }).catch((error) => {
      this.showError(error);
    });
  }  

  showError(text) {
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Erro',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Carregando...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

}
