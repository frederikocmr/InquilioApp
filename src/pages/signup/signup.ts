import { Component, ViewChild } from '@angular/core';
import { Slides, NavController } from 'ionic-angular';
import { Keyboard } from "@ionic-native/keyboard";

import { UserAccount } from "../../models/user-account";
import { FirebaseProvider, UiProvider } from "../../providers";
import { TabsPage } from '../tabs/tabs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { regexValidators } from '../../validators/validator';

@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
	@ViewChild('slides') slides: Slides;
  public monthShortNames: String[] = [
    "jan","fev","mar","abr","mai","jun",
    "jul","ago","set","out","nov","dez"
  ];
	public ownerButtonClass: string = 'profile-selected';
	public tenantButtonClass: string = 'profile-button';
	public profile: any;
	signupForm: FormGroup;

	account: UserAccount = new UserAccount();

	constructor(
    public formBuilder: FormBuilder,
    public keyboard: Keyboard,
		public navCtrl: NavController,
		public ui: UiProvider,
		private firebase: FirebaseProvider) {
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
	
	public getValuesFromForm(){
		let newObject = this.signupForm.value as UserAccount;
		this.account.document = newObject.document;
		this.account.name = newObject.name;
		this.account.email = newObject.email;
		this.account.password = newObject.password;
		this.account.phone = newObject.phone;
		this.account.birthdate = newObject.password;
		this.account.genre = newObject.genre;
	}

	openCalendar() {
		this.account.birthdate = new Date().toISOString();
	}

	setMaxDate() {
		return new Date().getFullYear() - 18;
	}

	profileSelected(profile: string) {
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

	slideNext() {
		this.slides.slideNext();
	}

	slidePrev() {
		this.slides.slidePrev();
	}

  isFirstSlide() {
    if (this.slides.isBeginning()) return true;
    else return false;
  }

	isLastSlide() {
		if (this.slides.isEnd()) {
			return true;
		}
		return false;
	}

	doSignup() {
		this.ui.showLoading();
		this.firebase.signUp(this.account, (this.profile ? this.profile : 'owner')).then((user) => {
			this.ui.showToast(this.firebase.message, 3, 'top');
			this.ui.closeLoading();
			if (this.firebase.validator) {
				this.navCtrl.setRoot(TabsPage);
			}
		}).catch((error) => {
			console.log(error);
			this.ui.closeLoading();
		});
	};


}
