import { NgZone, Component, trigger, state, style, transition, animate, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LoadingController, Content } from 'ionic-angular';
import { StylistProfile } from '../stylistprofile/stylistprofile';
import { FeedStylist } from '../feedstylist/feedstylist';

import { UserBooking } from '../userbooking/userbooking';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { PopUp } from '../../modals/popup/popup';
import { PopUpOther } from '../../modals/popupother/popupother';
import { OnDestroy } from "@angular/core";
import { ISubscription } from "rxjs/Subscription";
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Diagnostic } from '@ionic-native/diagnostic';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { UserViewProfile } from '../userviewprofile/userviewprofile';
import { UserProfile } from '../userprofile/userprofile';
import { FullfeedPage } from '../fullfeed/fullfeed';
import { CacheService } from 'ionic-cache';

import { SwiperConfigInterface } from 'ngx-swiper-wrapper';


const limit:BehaviorSubject<number> = new BehaviorSubject<number>(2); // import 'rxjs/BehaviorSubject';

@Component({
  selector: 'page-feed-user',
  templateUrl: 'feeduser.html',
  animations: [
 
    trigger('slideDown', [
      state('down', style({
        height: '250px',
      })),
      state('notDown', style({
        height:'88px',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('moveList', [
      state('down', style({
        top: 200 + "px",
      })),
      state('up', style({
        top: 38 + "px",
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('toolSlide', [
      state('down', style({
        top: '0px'
      })),
      state('up', style({
        top: '0px'
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('show', [
      state('down', style({
        display: 'block',
      })),
      state('up', style({
        display: 'none',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
    trigger('showHeight', [
      state('down', style({
        display: 'block',
      })),
      state('up', style({
        display: 'none',
      })),
      transition('* => *', animate('400ms ease-in')),
    ]),
  ]
})
export class FeedUser implements OnDestroy {
  @ViewChild('changeText') changeText: ElementRef;
  @ViewChild('availability') availability: ElementRef;
  @ViewChild('contentone') contentOne: ElementRef;
  @ViewChild('ratings') ratingbox: ElementRef;
  @ViewChild('weeklydeals') weekly: ElementRef;
  @ViewChild('promos') promos: ElementRef;
  @ViewChild('weekly') weeklyyellow: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('distance') distancey: ElementRef;
  @ViewChild('noavail') noavail;

  @ViewChild(Content  ) content: Content;

  downState: String = 'notDown';
  moveState: String = 'up';
  toolbarState: String = 'up';
  showDropDown: String = 'up';
  showDropDownHeight: String = 'up';
  appointments: FirebaseListObservable<any>;
  appointmentsMonth: FirebaseListObservable<any>;
  appointmentsItem: FirebaseListObservable<any>;
  show = true;
  lastScrollTop: number = 0;
  direction: string = "";
  prices: FirebaseListObservable<any>;
  ratingslist:FirebaseListObservable<any>
  distancelist: FirebaseListObservable<any>;
  prom: FirebaseListObservable<any>;
  pricesArray = [];
  distances = [];
  stars;
  starsArray = [];

  private subscription: ISubscription;
  private subscription2: ISubscription;
  private subscription3: ISubscription;
  private subscription4: ISubscription;
  private subscription5: ISubscription;
  private subscription6: ISubscription;
  private subscription7: ISubscription;
  private subscription8: ISubscription;
  private subscription9: ISubscription;
  private subscription10: ISubscription;


  queryable: boolean = true;


  toolbarClicks = 0;

  list: FirebaseListObservable<any>;
  objj: FirebaseObjectObservable<any>;
  availabilities = [];
  items = [];
  rating = [];
  promotions = [];

  totalCount = 0;
  lastNumRows = 0;
  el;
  startAtKey;
  startAtKeyAvail;
  lastKey;

  ads = [];
  swiperIndex;
  config: SwiperConfigInterface;
  swiperEvent;
  totalAdCount;
  swiperSize = 'begin';

  constructor(private cache: CacheService, private diagnostic: Diagnostic, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, public zone: NgZone, public modalCtrl: ModalController, public af: AngularFireDatabase, public storage: Storage, private afAuth: AngularFireAuth, public renderer: Renderer, public loadingController: LoadingController, public navCtrl: NavController) {
     
  }

  /*getAds() {
    console.log("in get addddssss ******");
    this.objj = this.af.object('/adcounter/count');

    this.subscription9 = this.objj.subscribe(item => { 
      console.log(JSON.stringify(item) + "in adddd subscribe()()()()()()");
      console.log(typeof item);
      this.totalAdCount = item.$value;
        for(let x = 1; x < item.$value + 1; x++) {

          let storageRef = firebase.storage().ref().child('/ads/ad' + x + '.png');
          storageRef.getDownloadURL().then(url => {
            console.log(url);
            this.ads.push(url);
          }).catch(e => {
            //
          });
        }
       
    })
    
  }*/



  getAds() {
    let promises_array:Array<any> = [];
    let cacheKey = 'ads';

    
      this.cache.getItem(cacheKey).catch(() => {
        let store = [];
        console.log("in get addddssss ******");
        this.objj = this.af.object('/adcounter/count')

        this.subscription6 = this.objj.subscribe(item => { 
          console.log(JSON.stringify(item) + "in adddd subscribe()()()()()()");
          console.log(typeof item);
          this.totalAdCount = item.$value;
          
            for(let x = 1; x < item.$value + 1; x++) {
              console.log("in promise gafdfsfads")
              promises_array.push(new Promise((resolve,reject) => {

                let storageRef = firebase.storage().ref().child('/ads/ad' + x + '.png');
                storageRef.getDownloadURL().then(url => {
                  console.log(url);
                  store.push(url);
                  console.log("reigh before resolve");
                  resolve()
                  
                }).catch(e => {
                  resolve();
                });

              }));
            }

          let results = Promise.all(promises_array);
          results.then((value) => {
            this.ads = store;

            console.log(JSON.stringify(this.ads) + " value value vlaue");

            console.log("in list all");
            
            return this.cache.saveItem(cacheKey, this.ads);
          })
      })

        
    }).then((data) => {
        console.log("Saved data: ", data);
        this.ads = data;
    });

  }



  indexChange() {
    console.log(this.swiperIndex);
    if(this.swiperSize == 'small' || 'begin') {
      if(this.totalAdCount - 4 == this.swiperIndex) {
        this.navCtrl.push(UserProfile,{},{animate:true,animation:'transition',duration:500,direction:'forward'});
      }
      else if(this.swiperIndex == 0) {
        //this.navCtrl.push(FollowersPage,{},{animate:true,animation:'transition',duration:500,direction:'back'});
      }
    }
    else {
      if(this.totalAdCount - 1 == this.swiperIndex) {
        this.navCtrl.push(UserProfile,{},{animate:true,animation:'transition',duration:500,direction:'forward'});
      }
      else if(this.swiperIndex == 0) {
        //this.navCtrl.push(FollowersPage,{},{animate:true,animation:'transition',duration:500,direction:'back'});
      }
    }
  }

  swipeLeft() {
    this.navCtrl.push(UserViewProfile, {
      param1: 'user'
    },{animate:true,animation:'transition',duration:500,direction:'forward'});
  }

  toUserBooking() {
    
  }

  toProfile() {
    this.navCtrl.push(StylistProfile,{},{animate:true,animation:'transition',duration:500,direction:'forward'});
  }

  toFull() {
    this.navCtrl.push(FullfeedPage,{},{animate:true,animation:'transition',duration:500,direction:'back'});
  }

  toBooking() {
    this.navCtrl.push(UserBooking, {
      param1: 'user'
    },{animate:true,animation:'transition',duration:500,direction:'back'});
  }

  ngOnDestroy() {
    if(this.subscription != null) {
      this.subscription.unsubscribe();
    }
    if(this.subscription2 != null) {
      this.subscription2.unsubscribe();
    }
    if(this.subscription3 != null) {
      this.subscription3.unsubscribe();
    }
    if(this.subscription4 != null) {
      this.subscription4.unsubscribe();
    }
    if(this.subscription5 != null) {
      this.subscription5.unsubscribe();
    }
    if(this.subscription6 != null) {
      this.subscription6.unsubscribe();
    }
    if(this.subscription7 != null) {
      this.subscription7.unsubscribe();
    }
    if(this.subscription8 != null) {
      this.subscription8.unsubscribe();
    }
    if(this.subscription9 != null) {
      this.subscription9.unsubscribe();
    }
    if(this.subscription10 != null) {
      this.subscription10.unsubscribe();
    }
  } 

  pushPage(){
    // push another page on to the navigation stack
    // causing the nav controller to transition to the new page
    // optional data can also be passed to the pushed page.
    //this.navCtrl.push(SignUpPage);
  }

  ionViewWillLoad() {
    this.subscription = this.afAuth.authState.subscribe(data => {
      /*if(data.email && data.uid) {
        console.log("logged in");
      }*/
    })


  }



  scrollHandler(event) {
   //console.log(JSON.stringify(event));
   this.zone.run(()=>{
     if(event.directionY == 'up') {
       this.show = false;
     }
     else {
       this.show = true;
     }
     // since scrollAmount is data-binded,
     // the update needs to happen in zone
     //this.scrollAmount++
   })
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    let radlat1 = Math.PI * lat1/180
    let radlat2 = Math.PI * lat2/180
    let theta = lon1-lon2
    let radtheta = Math.PI * theta/180
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }

  round(number, precision) {
    let factor = Math.pow(10, precision);
    let tempNumber = number * factor;
    let roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
  };

  loadDistances(): Promise<any> {
    return new Promise((resolve, reject) => {
      let cacheKey = "distances"
      let rrr;
      let arr = [];
      let mapped;
      //this.cache.removeItem(cacheKey);

      console.log("IN LOADDISTANCES #$$$$$$$$$$$$$$$$$$$$$");

      this.geolocation.getCurrentPosition().then((resp) => {            
          // resp.coords.latitude
          console.log("IN geo get position #$$$$$$$5354554354$$$$$$$");

          rrr = resp;
          console.log(rrr + "              rrrrrrrrrrrrrrrrrrrrrrrrrr");
          //this.cache.getItem(cacheKey).catch(() => {
          //setTimeout(() => {
            this.distancelist = this.af.list('/profiles/stylists');
      
            let x = 0;
            this.subscription6 = this.distancelist.subscribe(items => {

               mapped = items.map((item) => {
                return new Promise(resolve => {
                  let rr;
                  //console.log(JSON.stringify(item) + "               *((*&*&*&*&^&*&*&*(&*(&*&*(&(&(&*(              :::" + x);
                  if(item.address == "") {
                    resolve();
                  }
                  else {
                    console.log(item.address + " is the address empty??????");
                    this.nativeGeocoder.forwardGeocode(item.address)
                      .then((coordinates: NativeGeocoderForwardResult) => {
                        console.log("I AM IN THE GEOCODING ***&&*&*&*&*");
                          rr = this.round(this.distance(coordinates.latitude, coordinates.longitude, rrr.coords.latitude, rrr.coords.longitude, "M"), 1);
                          if(!item.picURL) {
                            item.picURL = 'assets/blankprof.png';
                          }
                          arr.push({'pic':item.picURL, 'salon':item.username, 'distance':rr});
                          console.log("push to the array of results");
                          //x++;
                          /*console.log(items.length + "         length   /    x:        " + x);
                          if(items.length - x == 1) {
                            console.log("getting resolved in geocoder ^&^&^&&^^&^&^&");
                            resolve(arr);
                          }*/
                          //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

                          resolve();
                        }).catch(e => {
                          console.log(e.message + " caught this error");
                          /*x++;
                          if(items.length - x == 1) {
                            resolve(arr);
                          }*/
                          resolve();
                        })

                    
                      //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

                  }


                })
              })

              let results = Promise.all(mapped);
              results.then(() => {
                console.log(JSON.stringify(arr) + " :FOSIEJO:SFJ::EFIJSEFIJS:EFJS:IO THIS IODIOSJ:FDSIJ :DIS");
                

                this.distances = arr.slice();
                console.log(JSON.stringify(this.distances) + " ^^^^&&&&&&&********88889999000000000");

                resolve();
                //return this.cache.saveItem(cacheKey, this.distances);
              })
            });

          })  
              
            /*}).then(data => {
              this.distances = data
            })*/
          //}, 1500)
 

          

      /*}).catch((error) => {
        this.diagnostic.switchToLocationSettings();
        console.log('Error getting location', error.message);
        resolve();
      });*/

    }).catch((error) => {
      console.log('Error getting location', error);
    });

    
  }

  loadPromotions() {
    console.log("In loadPromotions fdskkfdskldfkfdslkfds");
    
    this.prom = this.af.list('/promotions');

    this.promotions = [];

    this.subscription10 = this.prom.subscribe(items => items.forEach(item => {
      //mapped = items.map((item) => {
        //return new Promise(resolve => {

            this.promotions.push(item.customMetadata);
            console.log("pushing ITEM (((((()()()()()() promotions" + JSON.stringify(item.customMetadata));
            //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

          
        //})  
      //})
      
    }));

    if(this.promotions != []) {
      this.renderer.setElementStyle(this.noavail._elementRef.nativeElement, 'display', 'none');
    }
  }

  loadPrices() {
    //let mapped;
    //let cacheKey = "prices";
    //let results2;
    
    //this.cache.removeItem(cacheKey);

    //this.cache.getItem(cacheKey).catch(() => {

      //let array = [];

      this.prices = this.af.list('/profiles/stylists', {
        query: {
          orderByChild: 'price'
        }
      });
      this.subscription5 = this.prices.subscribe(items => items.forEach(item => {
        //mapped = items.map((item) => {
          //return new Promise(resolve => {
            if(item.price == null) {
              //
            }
            else {
              console.log(JSON.stringify(item));
              if(!item.picURL) {
                item.picURL = 'assets/blankprof.png';
              }
              this.pricesArray.push(item); console.log("     pushing ITEM (((((()()()()()() loadprices")
              //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

            }
          //})  
        //})
        
      }));

        //results2 = Promise.all(mapped);
        //results2.then(() => {  
        //this.pricesArray = array;
        //console.log(this.pricesArray + "     pricesarrrraaayyy ITEM (((((()()()()()() loadprices")   
        //return this.cache.saveItem(cacheKey, this.pricesArray);
      //})    
    /*}).then(data => {
      this.pricesArray = data;
    })*/
  }

  loadRatings(): Promise<any> {
    return new Promise((resolve, reject) => {
      let mapped;
      let cacheKey = "ratings";
      let results;
      let array = [];

      this.cache.getItem(cacheKey).catch(() => {

        this.ratingslist = this.af.list('/profiles/stylists');
        this.subscription7 = this.ratingslist.subscribe(items => {
          try {
            mapped = items.map((item) => {
              return new Promise(resolve => {
                if(!item.picURL) {
                  item.picURL = 'assets/blankprof.png';
                }

                for(let z in item.rating) {
                  console.log(z + "this is the rating string");
                }

                console.log(JSON.stringify(item) + "stringifyied item &&^^&%^%^%^$$%%$");
                if(item.type == "stylist") {
                  console.log("getting pushed &&%$$##@#@#@#@#@#");
                  array.push(item);
                }

                resolve();
                
              })

            })

         } catch(e) {
           console.log(e + "try catch try v98989980");
        }   
         
        }) 
        

        results = Promise.all(mapped);
        results.then(() => {
          return this.cache.saveItem(cacheKey, array);

        })

        
      }).then((data) => {

          console.log("resolved ***&&&^^^%%%$$$$$$$");
          resolve(data);
      })
    });
  }

  ionViewDidLoad() {

    this.loadPromotions();
    this.getAds();
    this.loadPrices();
    
    //this.getInitialImages();
    this.loadAvailabilities().then(() => {
      setTimeout(() => {
        console.log("in load availabilities ......... ")
        console.log(JSON.stringify(this.availabilities));

        this.availabilities.sort(function(a,b) {
          return Date.parse('01/01/2013 '+a.time) - Date.parse('01/01/2013 '+b.time);
        });

        console.log('*****previous******');
        console.log(JSON.stringify(this.availabilities));
        console.log('*****sorted********');
        
        for(let i of this.availabilities) {
          console.log(i.time + "          this is itime");
          let date = new Date('01/01/2013 ' + i.time);
          console.log(date + "          this is date in idate");
          let str = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
          console.log(str);
          i.time = str;
        }

      console.log("In load availabilities then thing aijosfeijofdsjoifadsjio");
      
      let ratings;
      let totalPotential;
      
      
      this.loadRatings().then((array) =>{

          console.log(array + '    ararrya &&*&&*&^^&%^%^');

          let r = 0;
          for(let item of array) {
            if(item.rating.one == 0 && item.rating.two == 0 && item.rating.three == 0 && item.rating.four == 0 && item.rating.five == 0) {
              this.stars = "No ratings";
            }
            else {

              console.log("making the stars");

              totalPotential = item.rating.one * 5 + item.rating.two * 5 + item.rating.three * 5 + item.rating.four * 5 + item.rating.five * 5;
              ratings = item.rating.one + item.rating.two * 2 + item.rating.three * 3 + item.rating.four * 4 + item.rating.five *5;
              

              let i = (ratings / totalPotential) * 100;
              if(Math.round(i) <= 20) {
                this.stars = '\u2605';
              }
              if(Math.round(i) > 20 && Math.round(i) <= 40) {
                this.stars = '\u2605\u2605';
              }
              if(Math.round(i) > 40 && Math.round(i) <= 60) {
                this.stars = '\u2605\u2605\u2605';
              }
              if(Math.round(i) > 60 && Math.round(i) <= 80) {
                this.stars = '\u2605\u2605\u2605\u2605';
              }
              if(Math.round(i) > 80) {
                this.stars = '\u2605\u2605\u2605\u2605\u2605';
              }
            }

            item.stars = this.stars;
            this.rating.push(item);
            //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');
            r++;
          }

          console.log("THIS IS THE SORTED ARRAY TO BE SORRRED        " + JSON.stringify(this.rating));

          this.rating.sort(function(a,b){ 
            if(a.stars !== "No ratings" && b.stars !== "No ratings") {
              if(a.stars === b.stars){
                return 0;
              }
              else {
                return a.stars.length < b.stars.length ? 1 : -1;
              }
            }
            else {
              if(a.stars === "No ratings"){
                return 1;
              }
              else if(b.stars === "No ratings"){
                return -1;
              }
            }

          });
       }).then(() => {
         this.loadDistances().then(() => {
           
         });
       })
      }, 1500);
    })

      
              



    
    ////this.renderer.setElementStyle(this.promos.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');

    /*setTimeout(() => {
      this.loadDistances();
    },1000)*/
    
  }

  presentProfileModal(salon, time) {
    let profileModal = this.modalCtrl.create(PopUp, { salon: salon, time: time});
    profileModal.present();
  }

  presentProfileModalDistance(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  presentProfileModalRatings(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  presentProfileModalPrice(salon) {
    let profileModal = this.modalCtrl.create(PopUpOther, { salon: salon });
    profileModal.present();
  }

  toolClicked(event) {
    this.toolbarClicks++;
    console.log('tapped');

    
    if(this.toolbarClicks == 1) {
      setTimeout(() => {
        if(this.toolbarClicks == 2) {
          console.log('running application');
          this.downState = (this.downState == 'notDown') ? 'down' : 'notDown';
          this.moveState = (this.moveState == 'up') ? 'down' : 'up';
          this.toolbarState = (this.toolbarState == 'up') ? 'down' : 'up';
          if(this.toolbarState == 'up') {
            this.config = {
              direction: 'horizontal',
              slidesPerView: '4',
              keyboardControl: false
            };

            this.swiperSize = 'small';

          }
          else {
            this.config = {
              direction: 'horizontal',
              slidesPerView: '1',
              keyboardControl: false
            };

            this.swiperSize = 'big';

            
          }
          this.toolbarClicks = 0;
        }
        else {
          this.toolbarClicks = 0;
        }
      }, 300)
    }
  }

  switchView() {
    this.navCtrl.push(FeedStylist);
  }

  closeMenu() {
    if(this.showDropDown == 'down' || this.showDropDownHeight == 'down') {
      this.showDropDown = 'up';
      this.showDropDownHeight = 'up';
    }
    else {
      //
    }
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', 'gray');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', '#e6c926');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');

    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


  }

  closeMenuP() {
    if(this.showDropDown == 'down' || this.showDropDownHeight == 'down') {
      this.showDropDown = 'up';
      this.showDropDownHeight = 'up';
    }
    else {
      //
    }
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');

    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


  }

  dropDown() {
 
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    
    if(this.downState == 'down') {
      this.showDropDownHeight = (this.showDropDownHeight == 'up') ? 'down' : 'up';
    }
    else {
      this.showDropDown = (this.showDropDown == 'up') ? 'down' : 'up';
    }
  }

  dropDownD() {
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'block');



    this.changeText.nativeElement.innerHTML = "Distance";
    this.dropDown();
  }

  dropDownA() {
    this.changeText.nativeElement.innerHTML = "Availability";
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');


    this.dropDown();
  }

  dropDownP() {
    this.changeText.nativeElement.innerHTML = "Price";
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'block');
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'none');

    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');



    this.dropDown();
  }

  dropDownR() {
    this.changeText.nativeElement.innerHTML = "Rating";
    this.renderer.setElementStyle(this.changeText.nativeElement, 'color', '#e6c926');
    this.renderer.setElementStyle(this.weeklyyellow.nativeElement, 'color', 'gray');
    //this.renderer.setElementStyle(this.promos.nativeElement, 'color', 'gray');
    
    //this.renderer.setElementStyle(this.contentOne.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.availability.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.ratingbox.nativeElement, 'display', 'block');
    this.renderer.setElementStyle(this.weekly.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.price.nativeElement, 'display', 'none');
    this.renderer.setElementStyle(this.distancey.nativeElement, 'display', 'none');


    this.dropDown();
  }

  gotoProfile() {
    this.navCtrl.push(StylistProfile);
  }

  onScroll(event) {
    console.log(event);
  }

  loadAvailabilities(): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this.appointments = this.af.list('/appointments');
      this.subscription2 = this.appointments.subscribe(items => items.forEach(item => {
        console.log(item);
        let userName = item.$key;
        this.availabilities = [];
        for(let x in item) {
          let month = x;
          console.log(x + "      month");
          this.appointmentsMonth = this.af.list('/appointments/' + userName + '/' + month);
          this.subscription3 = this.appointmentsMonth.subscribe(items => items.forEach(item => {
            this.startAtKeyAvail = item.$key;
            //console.log(JSON.stringify(item) + "           item");
            let date = new Date(item.date.day * 1000);
            let today = new Date();
            console.log(date.getMonth() + "==" + today.getMonth()  + "&&" + date.getDate() + "==" + today.getDate());
            console.log("IN LOAD AVAILABILITIES *(*((**(*(*(*(*(*(*&^^^^%^%556565656565");
            if(date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {
              console.log("            inside the if that checks if its today");
              console.log(item.reserved.appointment + "                *************appointment");
              //let counter = 0;
              item.reserved.appointment.forEach((r, index) => {
                if(r.selected == true) {
                  //this.renderer.setElementStyle(this.noavail.nativeElement, 'display', 'none');

                  let storageRef = firebase.storage().ref().child('/settings/' + userName + '/profilepicture.png');
                   
                  let obj = {'pic':"", 'salon': userName, 'time': r.time};

                  storageRef.getDownloadURL().then(url => {
                    console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
                    obj.pic = url;
                    this.availabilities.push(obj);
                  }).catch((e) => {
                    console.log("in caught url !!!!!!!$$$$$$$!!");
                    obj.pic = 'assets/blankprof.png';
                    this.availabilities.push(obj);
                  });

                  console.log(index + "         this is index !@@@@@!!");
                  console.log(JSON.stringify(this.availabilities));
                  
                  
                }

                if(index == 23) {
                  console.log("IN RESOLVE *(**(*(#*(*(#*(#*(#*(#))))))))");
                  console.log(JSON.stringify(this.availabilities));
                  resolve();
                }
              })

              
            }
          }));

          
        }

        
      }));
    })
    
  }

  

  setDateTime(time) {
    let date = new Date();
    let index = time.indexOf(":"); // replace with ":" for differently displayed time.
    let index2 = time.indexOf(" ");

    let hours = time.substring(0, index);
    let minutes = time.substring(index + 1, index2);

    var mer = time.substring(index2 + 1, time.length);

    console.log(mer + "        *******AMPM");

    if (mer == "PM") {
        console.log(hours + "        ())()()(()hours before(()()(");
        let number = parseInt(hours) + 12;
        hours = number.toString();
        console.log(hours + "      **********hours after*******");
    }


    date.setHours(hours);
    date.setMinutes(minutes);

    return date;
  }



  getInitialImages() {


     

    

        /*.then(array => {
        setTimeout(() => {
          console.log(JSON.stringify(array) + " :FOSIEJO:SFJ::EFIJSEFIJS:EFJS:IO THIS IODIOSJ:FDSIJ :DIS");
          //
            
          //}, 1000)
          
        }, 2000);*/
          
      //})
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');
    console.log(this.content.directionY + "        upupupupupupu********");
    if(this.content.directionY == 'up') {
      this.show = false
    }
    else {
      this.show = true;
    }


    //return new Promise((resolve, reject) => {
    setTimeout(() => {


      console.log(this.startAtKey + "     before %%^&^&^% start at");
      this.list = this.af.list('/promos', {
      query: {
        orderByKey: true,
        endAt: this.startAtKey,
        limitToLast: 11
      }});

      this.list.subscribe(items => { 
          let x = 0;
          this.lastKey = this.startAtKey;
          items.forEach(item => {


            let storageRef = firebase.storage().ref().child('/settings/' + item.customMetadata.username + '/profilepicture.png');
                       
            storageRef.getDownloadURL().then(url => {
              console.log(url + "in download url !!!!!!!!!!!!!!!!!!!!!!!!");
              item.customMetadata.picURL = url;
            }).catch((e) => {
              console.log("in caught url !!!!!!!$$$$$$$!!");
              item.customMetadata.picURL = 'assets/blankprof.png';
            });
            
            if(this.startAtKey !== item.$key && this.lastKey !== item.$key) {
              console.log(this.startAtKey + "   :startatkey before 4444444        item key:     " + item.$key);
              this.items.push(item.customMetadata);
            }

            if(x == 0) {
              this.startAtKey = item.$key;
            }

            x++;
          });          
          
      })

      infiniteScroll.complete(); 
        
      }, 500);

  }

}