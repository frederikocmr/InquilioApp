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
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { regexValidators } from "../../validators/validator";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loading: Loading;
  isKeyboardVisible: boolean = false;
  signupPage = SignupPage;
  loginForm: FormGroup;
  registerCredentials = { email: "", password: "" };

  constructor(
    public formBuilder: FormBuilder,
    public keyboard: Keyboard,
    private alertCtrl: AlertController,
    private firebase: FirebaseProvider,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    public ui: UiProvider
  ) {
		this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(regexValidators.email), Validators.required])],
      password: ['', Validators.required]
    });
  }
	
  showListener() {
    document.getElementById('footer').classList.add('keyboard-is-open');
	}
	
  hideListener() {
    document.getElementById('footer').classList.remove('keyboard-is-open');
  }

  ionViewDidEnter() {
    window.addEventListener('keyboardWillShow', this.showListener);
    window.addEventListener('keyboardDidHide', this.hideListener);
  }

  ionViewWillLeave() {
    window.removeEventListener('keyboardWillShow', this.showListener);
    window.removeEventListener('keyboardDidHide', this.hideListener);
  }

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
      .signIn(this.loginForm.value.email, this.loginForm.value.password)
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

  toggleKeyboard() {

  }
}
