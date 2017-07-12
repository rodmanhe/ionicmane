import { Component, NgModule, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgCalendarModule  } from 'ionic2-calendar';
//import { IonicApp, IonicModule } from 'ionic-angular';
//import { MyApp } from './app/app.component';

@Component({
  selector: 'page-stylist-profile',
  templateUrl: 'stylistprofile.html',
  animations: [
    trigger('moveCover', [
      state('down', style({
        top: '-103px',
      })),
      state('up', style({
        top: '-192px',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
  ]
})
export class StylistProfile {
  viewDate = new Date();
  events = [];
  calendar = {'mode': 'month', 'currentDate': this.viewDate}
  moveState: String = 'up';

  constructor(public navCtrl: NavController) {

  }

  pushPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    //this.navCtrl.push(SignUpPage);
  }

  ionViewDidLoad() {

  }

  moveCover() {
    this.moveState = (this.moveState == 'up') ? 'down' : 'up';
  }

  onCurrentDateChanged($event) {}

  reloadSource(startTime, endTime) {}

  onEventSelected($event) {}

  onViewTitleChanged($event) {}

  onTimeSelected($event) {}
}