import { Component, ViewChild } from '@angular/core';
import { Slides, NavController } from 'ionic-angular';
import { Keyboard } from "@ionic-native/keyboard";

import { UserAccount } from "../../models/user-account";
import { FirebaseProvider, UiProvider } from "../../providers";
import { TabsPage } from '../tabs/tabs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { regexValidators } from '../../validators/validator';
import { TenantTabsPage } from '../tenant-tabs/tenant-tabs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
	@ViewChild('slides') slides: Slides;
	public isTextFieldType: boolean;
  public monthShortNames: String[] = [
    "jan","fev","mar","abr","mai","jun",
    "jul","ago","set","out","nov","dez"
  ];
	public ownerButtonClass: string = 'profile-selected';
	public tenantButtonClass: string = 'profile-button';
	public profile: any;
	public signupForm: FormGroup;

	public account: UserAccount = new UserAccount();

	constructor(
    public formBuilder: FormBuilder,
    public keyboard: Keyboard,
		public navCtrl: NavController,
		public ui: UiProvider,
		private firebase: FirebaseProvider,
		private afDb: AngularFirestore) {
		this.signupForm = this.formBuilder.group({
			document: ['', Validators.compose([Validators.pattern(regexValidators.cpfCpnj), Validators.required])],
			name: ['', Validators.required],
			email: ['', Validators.compose([Validators.pattern(regexValidators.email), Validators.required])],
			password: ['', Validators.required],
			phone: ['', Validators.compose([Validators.pattern(regexValidators.phone), Validators.required])],
			birthdate: ['', Validators.required],
			genre: ['', Validators.required]
		});
	}

  public togglePasswordFieldType(): void {
    this.isTextFieldType = !this.isTextFieldType;
  }
	
  public showListener() {
    document.getElementById('footer').classList.add('keyboard-is-open');
	}
	
  public hideListener() {
    document.getElementById('footer').classList.remove('keyboard-is-open');
  }

  public ionViewDidEnter() {
    window.addEventListener('keyboardWillShow', this.showListener);
    window.addEventListener('keyboardDidHide', this.hideListener);
  }

  public ionViewWillLeave() {
    window.removeEventListener('keyboardWillShow', this.showListener);
    window.removeEventListener('keyboardDidHide', this.hideListener);
  }
	
	public getValuesFromForm(){
		let newObject = this.signupForm.value as UserAccount;
		this.account.document = newObject.document;
		this.account.name = newObject.name;
		this.account.email = newObject.email;
		this.account.password = newObject.password;
		this.account.phone = newObject.phone;
		this.account.birthdate = newObject.birthdate;
		this.account.genre = newObject.genre;
	}

	public openCalendar() {
		this.account.birthdate = new Date().toISOString();
	}

	public setMaxDate(): number {
		return new Date().getFullYear() - 18;
	}

	public profileSelected(profile: string): void {
		this.profile = profile;

		if (profile == 'owner') {
			if (this.ownerButtonClass == 'profile-button') {
				this.ownerButtonClass = 'profile-selected';
				this.tenantButtonClass = 'profile-button';
			} else {
				this.ownerButtonClass = 'profile-button';
			}
		} else if (profile == 'tenant') {
			if (this.tenantButtonClass == 'profile-button') {
				this.tenantButtonClass = 'profile-selected';
				this.ownerButtonClass = 'profile-button';
			} else {
				this.tenantButtonClass = 'profile-button';
			}
		}
	}

	public slideNext(): void {
		this.slides.slideNext();
	}

	public slidePrev(): void  {
		this.slides.slidePrev();
	}

  public isFirstSlide(): boolean  {
    if (this.slides.isBeginning()) return true;
    else return false;
  }

	public isLastSlide(): boolean  {
		if (this.slides.isEnd()) {
			return true;
		}
		return false;
	}

	public doSignup(): void {
		this.ui.showLoading();
		this.getValuesFromForm();
		if(this.firebase.checkIfDocumentExists(this.account.document, this.profile ? this.profile : 'owner')){
			this.firebase.signUp(this.account, (this.profile ? this.profile : 'owner')).then((user) => {
				this.ui.showToast(this.firebase.message, 3, 'top');
	
				if (this.firebase.validator) {
					this.chooseRoot();
				}
			}).catch((error) => {
				console.log(error);
				this.ui.closeLoading();
			});
		}
	};

	public chooseRoot(): void {
    this.afDb.collection('ownerAccount').doc(this.firebase.user.uid).snapshotChanges().subscribe(res => {

      if (res.payload.exists) {
        this.ui.closeLoading();
        console.log('usuário é owner.');
        this.navCtrl.setRoot(TabsPage);
      } else {
        this.ui.closeLoading();
        this.navCtrl.setRoot(TenantTabsPage);
      }
    });
  }
}
