import { Component, ViewChild } from '@angular/core';
import { Slides, NavController, ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import { UserAccount } from '../../models/user-account';
import { FirebaseProvider } from '../../providers';

@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {
	@ViewChild('slides') slides: Slides;
	ownerButtonClass: string = 'profile-button';
	tenantButtonClass: string = 'profile-button';
	loginPage = LoginPage;
	profile: any;

	account: UserAccount = new UserAccount();

	constructor(
		public navCtrl: NavController,
		public toastCtrl: ToastController,
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

	isLastSlide() {
		if (this.slides.isEnd()) {
			return true;
		}
		return false;
	}

	doSignup() {
		this.firebase.signUp(this.account, this.profile).then((user) => {
			let toast = this.toastCtrl.create({
				message: this.firebase.message,
				duration: 2000,
				position: 'top'
			});
			toast.present();

			if (this.firebase.validator) {
				this.navCtrl.push(LoginPage);
			}


		}).catch((error) => {
			console.log(error);
		});
	};


}
