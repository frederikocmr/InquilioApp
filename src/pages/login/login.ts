import { TenantTabsPage } from './../tenant-tabs/tenant-tabs';
import { Component } from "@angular/core";
import { FirebaseProvider, UiProvider } from "../../providers";
import { NavController } from "ionic-angular";
import { Keyboard } from "@ionic-native/keyboard";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { SignupPage } from "../signup/signup";
import { TabsPage } from "../tabs/tabs";
import { regexValidators } from "../../validators/validator";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  public isKeyboardVisible: boolean = false;
  public signupPage = SignupPage;
  public isTextFieldType: boolean;
  public loginForm: FormGroup;
  public registerCredentials = { email: "", password: "" };

  constructor(
    public formBuilder: FormBuilder,
    public keyboard: Keyboard,
    private firebase: FirebaseProvider,
    private navCtrl: NavController,
    private afDb: AngularFirestore,
    public ui: UiProvider
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(regexValidators.email), Validators.required])],
      password: ['', Validators.required]
    });
  }

  public togglePasswordFieldType(): void {
    this.isTextFieldType = !this.isTextFieldType;
  }

  public showListener(): void {
    document.getElementById('footer').classList.add('keyboard-is-open');
  }

  public hideListener(): void {
    document.getElementById('footer').classList.remove('keyboard-is-open');
  }

  public ionViewDidEnter(): void {
    window.addEventListener('keyboardWillShow', this.showListener);
    window.addEventListener('keyboardDidHide', this.hideListener);
  }

  public ionViewWillLeave(): void {
    window.removeEventListener('keyboardWillShow', this.showListener);
    window.removeEventListener('keyboardDidHide', this.hideListener);
  }

  public createAccount(): void {
    this.navCtrl.push(SignupPage);
  }

  public doLoginWithEmail(): void {
    this.ui.showLoading();
    this.firebase
      .signIn(this.loginForm.value.email, this.loginForm.value.password)
      .then(() => {
        this.ui.showToast(this.firebase.message, 3, "top");

        if (this.firebase.validator) {
          this.chooseRoot();
        } else {
					this.ui.closeLoading();
				}
      })
      .catch(error => {
        this.ui.showToast(error, 3, 'top');
        this.ui.closeLoading();
      });
  }

  public chooseRoot(): void {
    this.afDb.collection('ownerAccount').doc(this.firebase.user.uid).snapshotChanges().subscribe(res => {

      if (res.payload.exists) {
        this.ui.closeLoading(true);
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.ui.closeLoading(true);
        this.navCtrl.setRoot(TenantTabsPage);
      }
    });
  }

  public toggleKeyboard() { }
}
