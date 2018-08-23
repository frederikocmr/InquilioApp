import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  @ViewChild('slides') slides: Slides;
	ownerButtonClass: string = 'profile-button';
	tenantButtonClass: string = 'profile-button';	
	loginPage = LoginPage;
	today: any;
	
	constructor() {
	}

	openCalendar() {
		this.today = new Date().toISOString();
	}
	
	setMaxDate() {
		return new Date().getFullYear()-18;
	}

	profileSelected(profile: string) {
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
}
