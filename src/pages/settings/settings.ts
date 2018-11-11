import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { FirebaseProvider, SettingsProvider } from '../../providers';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from 'firebase';
import { ProfileFormPage } from '../profile-form/profile-form';
import { UserAccount } from './../../models/user-account';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public backgroundClass: string;
  public cardColor: string;
  public formClass: string;
  public iconColor: string;
  public textColor: string;
  public options: any;
  public user: User;
  public userData: UserAccount;
  public userType: string;
  public version: string;
  public settingsReady = false;
  public form: FormGroup;
  public profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };
  public page: string = 'main';
  public pageTitleKey: string = 'SETTINGS_TITLE';
  public subSettings: any = SettingsPage;

  constructor(
    private fb: FirebaseProvider,
    public navCtrl: NavController,
    public settings: SettingsProvider,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public modalCtrl: ModalController) {
    this.user = this.fb.user;
    this.userData = this.fb.userData;

    if (navParams.get('userType')) this.userType = navParams.get('userType');
    else this.userType = "owner";
    this.changeLayout(this.userType);
  }

  signOut() {
    this.fb.signOut();
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.page;
    this.pageTitleKey = this.pageTitleKey;


    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  // Changes the color of some elements depending on the type of user
  private changeLayout(user: string): void {
    if (user == "owner") {
      this.backgroundClass = "bg-owner-page";
      this.cardColor = "primary700";
      this.formClass = "custom-form";
      this.iconColor = "light";
      this.textColor = "light-text";
      this.version = "Versão Dono de Imóvel";
    } else {
      this.backgroundClass = "bg-tenant-page";
      this.cardColor = "light";
      this.formClass = "custom-form-tenant";
      this.iconColor = "primary"
      this.textColor = "primary-text";
      this.version = "Versão Inquilino";
    }
  }

  editUser() {
    let modal = this.modalCtrl.create(ProfileFormPage, { user: this.user, userType: this.userType });
    modal.present();
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

}
