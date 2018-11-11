import { TenantTabsPage } from './../tenant-tabs/tenant-tabs';
import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from 'firebase';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { regexValidators } from '../../validators/validator';
import { FirebaseProvider, UiProvider } from '../../providers';
import { UserAccount } from '../../models/user-account';

@Component({
  selector: 'page-profile-form',
  templateUrl: 'profile-form.html',
})
export class ProfileFormPage {
  public backgroundClass: string;
  public cardColor: string;
  public formClass: string;
  public iconColor: string;
  public textColor: string;
  public user: User;
  public userAccount: UserAccount = new UserAccount();
  public userType: string;
  public profileForm: FormGroup;
  public isNewUser: boolean = false;
  public monthShortNames: String[] = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez"
  ];

  constructor(
    private formBuilder: FormBuilder,
    private fb: FirebaseProvider,
    public ui: UiProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {

    if (navParams.get('user')) {
      this.user = navParams.get('user');
      this.fb.getUserData(this.user.uid, true);
    }

    if (navParams.get('isNewUser')) {
      this.isNewUser = navParams.get('isNewUser');
    }

    if (navParams.get('userType')) {
      this.userType = navParams.get('userType');
    } else {
      this.userType = "owner";
    }

    this.profileForm = this.formBuilder.group({
      document: [{ value: (this.fb.userData ? this.fb.userData.document : ''), disabled: !this.isNewUser }, Validators.compose([Validators.pattern(regexValidators.cpfCpnj), Validators.required])],
      name: [(this.fb.userData ? this.fb.userData.name : (this.user ? this.user.displayName : '')), Validators.required],
      email: [{ value: (this.fb.userData ? this.fb.userData.email : (this.user ? this.user.email : '')), disabled: true }, Validators.compose([Validators.pattern(regexValidators.email), Validators.required])],
      phone: [(this.fb.userData ? this.fb.userData.phone : (this.user ? this.user.phoneNumber : '')), Validators.required],
      birthdate: [(this.fb.userData ? this.fb.userData.birthdate : ''), Validators.required],
      genre: [(this.fb.userData ? this.fb.userData.genre : ''), Validators.required]
    });

    this.changeLayout(this.userType);
  }

  // Changes the color of some elements depending on the type of user
  private changeLayout(user: string): void {
    if (user == "owner") {
      this.backgroundClass = "bg-owner-page";
      this.cardColor = "primary700";
      this.formClass = "custom-form";
      this.iconColor = "light";
      this.textColor = "light-text";
    } else {
      this.backgroundClass = "bg-tenant-page";
      this.cardColor = "light";
      this.formClass = "custom-form-tenant";
      this.iconColor = "primary"
      this.textColor = "primary-text";
    }
  }

  public getValuesFromForm() {
    let newObject = this.profileForm.value as UserAccount;
    this.userAccount.document = newObject.document;
    this.userAccount.name = newObject.name;
    this.userAccount.email = newObject.email;
    this.userAccount.phone = newObject.phone;
    this.userAccount.birthdate = newObject.birthdate;
    this.userAccount.genre = newObject.genre;
    this.userAccount.id = this.user.uid;
  }

  public saveProfile(): void {
    this.ui.showLoading();
    this.getValuesFromForm();
    if (!this.isNewUser) {
      this.fb.updateDataFromCollection(this.userType + "Account", this.userAccount).then(
        () => {
          this.ui.showToast(this.fb.message, 2, 'top');

          if (this.fb.validator) {
            this.navCtrl.pop();
          }
          this.ui.closeLoading();
        }
      ).catch(error => {
        this.ui.closeLoading();
        this.ui.showAlert("Erro ao atualizar perfil: ", error);
      });
    } else { 
      this.fb.insertDataToDocument(this.userType + "Account", this.user.uid , this.userAccount).then(
        () => {
          this.ui.showToast(this.fb.message, 2, 'top');

          if (this.fb.validator) {
            this.navCtrl.pop();
            this.navCtrl.setRoot(this.userType == "owner" ? TabsPage : TenantTabsPage);
          }
          this.ui.closeLoading();
        }
      ).catch(error => {
        this.ui.closeLoading();
        this.ui.showAlert("Erro ao criar perfil: ", error);
      });
    }
  }

  public setMaxDate(): number {
    return new Date().getFullYear() - 18;
  }

}
