import { Component } from "@angular/core";
import { SignupPage } from "../signup/signup";
import { FirebaseProvider, UiProvider } from "../../providers";
import {
  NavController,
  Loading,
  LoadingController,
  AlertController
} from "ionic-angular";
import { TabsPage } from "../tabs/tabs";
import { Keyboard } from "@ionic-native/keyboard";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loading: Loading;
  signupPage = SignupPage;
  registerCredentials = { email: "", password: "" };
  email: string = "";
  password: string = "";

  constructor(
    public keyboard: Keyboard,
    private alertCtrl: AlertController,
    private firebase: FirebaseProvider,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    public ui: UiProvider
  ) {}

  public createAccount() {
    this.navCtrl.push(SignupPage);
  }

  doLoginWithGoogle() {
    this.showLoading();
    this.firebase
      .signInWithGoogle()
      .then(() => {
        this.loading.dismiss();
        this.ui.showToast(this.firebase.message, 3, "top");

        if (this.firebase.validator) {
          this.navCtrl.setRoot(TabsPage);
        }
      })
      .catch(error => {
        this.showError(error);
      });
  }

  doLoginWithEmail() {
    this.firebase
      .signIn(this.registerCredentials.email, this.registerCredentials.password)
      .then(() => {
        this.ui.showToast(this.firebase.message, 3, "top");

        if (this.firebase.validator) {
          this.navCtrl.setRoot(TabsPage);
        }
      })
      .catch(error => {
        this.showError(error);
      });
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: "Erro",
      subTitle: text,
      buttons: ["OK"]
    });
    alert.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: "Carregando...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }
}
