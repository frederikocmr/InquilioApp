import { UiProvider } from './../../providers/ui/ui';
import { Component, ViewChild } from '@angular/core';
import { Slides, NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Keyboard } from "@ionic-native/keyboard";

import { UserAccount } from "../../models/user-account";
import { FirebaseProvider } from "../../providers";

@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
	@ViewChild('slides') slides: Slides;
	ownerButtonClass: string = 'profile-selected';
	tenantButtonClass: string = 'profile-button';
	loginPage = LoginPage;
	profile: any;

	account: UserAccount = new UserAccount();

	constructor(
    public keyboard: Keyboard,
		public navCtrl: NavController,
		public ui: UiProvider,
		private firebase: FirebaseProvider) {
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
		this.firebase.signUp(this.account, this.profile).then((user) => {
			this.ui.showToast(this.firebase.message, 3, 'top');

			if (this.firebase.validator) {
				this.navCtrl.push(LoginPage);
			}

		}).catch((error) => {
			console.log(error);
		});
	};


}
