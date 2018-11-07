import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UiProvider, FirebaseProvider } from '../../../providers';

@Component({
  selector: 'page-tenant-evaluation',
  templateUrl: 'tenant-evaluation.html',
})
export class TenantEvaluationPage {
  evaluationForm: FormGroup;
  overallScore: number = 0;
  stars = [
    {value: 1, name: "custom-star-border"},
    {value: 2, name: "custom-star-border"},
    {value: 3, name: "custom-star-border"},
    {value: 4, name: "custom-star-border"},
    {value: 5, name: "custom-star-border"}
  ];

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public ui: UiProvider,
    private fb: FirebaseProvider) {    
    this.evaluationForm = this.formBuilder.group({});
  }

  public getStarName(value): void {
    this.stars.forEach(star => {
      if (star.value <= value) {
        star.name = "custom-star-full";
      } else {
        star.name = "custom-star-border";
      }
    });
    
    this.overallScore = value;
  }

  public saveEvaluation(): void {}
}
