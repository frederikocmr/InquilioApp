import { Component } from "@angular/core";
import { ViewController, NavParams } from "ionic-angular";

@Component({
  template: `
		<div class="list-options">
			<ion-list>
				<ion-list-header>Ordenar por</ion-list-header>			
				<button ion-item (click)="close()">Nome (A a Z)</button>		
				<button ion-item (click)="close()">Nome (Z a A)</button>		
				<button ion-item (click)="close()">Data (mais recente primeiro)</button>		
				<button ion-item (click)="close()">Data (mais antigo primeiro)</button>
			</ion-list>
			<ion-list>
				<ion-list-header>Visualizar</ion-list-header>			
				<button *ngFor="let item of items" ion-item (click)="close(item)">{{item}}</button>
			</ion-list>
		</div>
  `
})
export class ListOptionsComponent {
	items;

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
		this.getItems(navParams.get('type'));
	}

  close(item) {
		console.log(item);
    this.viewCtrl.dismiss();
  }

	getItems(type) {
		switch(type) {
			case 'contract':
				this.items = ["Apenas contratos ativos", "Apenas contratos encerrados", "Todos os contratos"];
				break;
			case 'realEstate':
				this.items = ["Apenas imóveis alugados", "Apenas imóveis sem contrato", "Todos os imóveis"];
				break;
			case 'tenant':
				this.items = ["Apenas inquilinos atuais", "Apenas inquilinos antigos", "Todos os inquilinos"];
				break;
		}
	}
}