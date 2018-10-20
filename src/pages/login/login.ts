import { Component, ViewChild } from '@angular/core';
import { MainMenuPage } from '../main-menu/main-menu';

import { SignupPage } from '../signup/signup';
import { FirebaseProvider } from '../../providers';
import { ToastController, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loading: Loading;
  mainMenuPage = MainMenuPage;
  signupPage = SignupPage;
  registerCredentials = { email: '', password: '' };
  // TODO: Fix login with email and password
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
    this.firebase.signInWithGoogle().then(() => {
			let toast = this.toastCtrl.create({
				message: this.firebase.message,
				duration: 2000,
				position: 'top'
			});
      toast.present();

			if(this.firebase.validator) {
				this.navCtrl.push(MainMenuPage);
      }
      
    }).catch((error) => {
      console.log(error);
    });
  }

  doLoginWithEmail() {
    this.firebase.signIn(this.email, this.password).then(() => {
			let toast = this.toastCtrl.create({
				message: this.firebase.message,
				duration: 2000,
				position: 'top'
			});
      toast.present();

			if(this.firebase.validator) {
				this.navCtrl.push(MainMenuPage); // setRoot?
      }
      
    }).catch((error) => {
      console.log(error);
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
