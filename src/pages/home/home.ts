import { Component } from '@angular/core';
import { MainMenuPage } from '../main-menu/main-menu';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mainMenu = MainMenuPage;
  loginPage = LoginPage;
  signupPage = SignupPage;

  descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel lacinia diam. Fusce sed imperdiet neque, sed posuere sapien.',
    'Quisque ornare, tortor vitae accumsan facilisis, tortor ipsum convallis enim, eu volutpat tortor dui eget risus.',
    'Aenean nulla urna, malesuada ut magna eget, lobortis vestibulum est.'];


}
