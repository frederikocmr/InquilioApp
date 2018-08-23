import { Component } from '@angular/core';
import { MainMenuPage } from '../main-menu/main-menu';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  mainMenuPage = MainMenuPage;
  signupPage = SignupPage;
}
