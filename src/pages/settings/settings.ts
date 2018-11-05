import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider, SettingsProvider  } from '../../providers';
import { FormGroup, FormBuilder } from '@angular/forms';
import { User } from 'firebase';
import { ProfileFormPage } from '../profile-form/profile-form';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  options: any;
  user: User;
  // TODO: Pegar dados do banco deste usuário logado... Por enquanto só está pegando do GoogleUser

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';

  subSettings: any = SettingsPage;

  constructor(
    private fb: FirebaseProvider,  
    public navCtrl: NavController,
    public settings: SettingsProvider ,
    public formBuilder: FormBuilder,
    public navParams: NavParams) {
      this.user = this.fb.user;
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
    this.pageTitleKey =  this.pageTitleKey;


    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  editUser() {
    this.navCtrl.push(ProfileFormPage, {user: this.user});
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

}
