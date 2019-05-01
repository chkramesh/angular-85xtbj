import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import {Http, RequestOptionsArgs, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'
import { LocalStorageService } from 'ngx-webstorage';

import { CommonDataService}  from './common-data.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular 7 reactive form with dynamic fields and validations example';
  exampleForm: FormGroup;
  // totalSum: number = 0;
  // myFormValueChanges$;
  langs: string[] = ["English", "French", "German"];
  countries = [{'id':1, 'name':'India'}, {'id':2, 'name': 'USA'}, {'id':3, 'name': 'UK'}];
  allSkills: Observable<any[]>;

  constructor(
    private formBuilder: FormBuilder,
    private http: Http,
    private storage: LocalStorageService,
    private currencyPipe: CurrencyPipe,
    private commonDataService: CommonDataService
  ) { }

 // build the user edit form
  public buildForm() {
      // create form with validators
      this.exampleForm = this.formBuilder.group({
      companyName: ['', [Validators.required,Validators.maxLength(25)]],
      countryName: [''],
      city: [''],
      zipCode: [''],
      street: [''],
      firstName : ['', [Validators.required,Validators.minLength(3), Validators.maxLength(10)]],
      lastName : '',
      email : '',
      test1 : '',
      test2 : '',
      test3 : '',
      test4 : '',
      test5 : '',
      test6 : '',
      fromLoc : '',
      toLoc : '',
      dob: '',
      gender: 'yes',
      'storeName': '',
      'fromStore': '',
      'toStore': '',
      'region': '',
      'state': '',
      // country: '',
      country: [this.countries[2].id],
      checked: false,
      indeterminate: false,
      locationflag:true,
      homelocation:true,
      language:'',
      // skill:''
      skill: [this.allSkills[2]]
    });
  }

  /**  Form initialization  */
  ngOnInit () {

    this.allSkills = this.commonDataService.getSkills();
    console.log('this.allSkills = ' + this.allSkills);
    // console.log('this.allSkills = ' + this.allSkills[1].name);
    console.log('this.allSkills = ' + this.allSkills[1]);

    // console.log('this.countries = ' + this.countries);
    // console.log('this.countries = ' + this.countries[1]);
     console.log('this.countries = ' + this.countries[1].name);

    this.buildForm();
    // // create form with validators
    // this.exampleForm = this.formBuilder.group({
    //   companyName: ['', [Validators.required,Validators.maxLength(25)]],
    //   countryName: [''],
    //   city: [''],
    //   zipCode: [''],
    //   street: [''],
    //    firstName : '',
    //   lastName : '',
    //   email : '',
    //   test1 : '',
    //   test2 : '',
    //   test3 : '',
    //   test4 : '',
    //   test5 : '',
    //   test6 : '',
    //   fromLoc : '',
    //   toLoc : '',
    //   gender: 'yes',
    //   'storeName': '',
    //   'fromStore': '',
    //   'toStore': '',
    //   'region': '',
    //   'state': '',
    //   'country': '',
    //   checked: false,
    //   indeterminate: false,
    //   locationflag:true,
    //   homelocation:true
    // });
    
    // preload some data into form fields
    const geoIpInfo = this.storage.retrieve('geoIpInfo');
    if(geoIpInfo) {
      this.exampleForm.patchValue({
        countryName: geoIpInfo.country_name,
        city: geoIpInfo.city,
        zipCode: geoIpInfo.postal,
        companyName: geoIpInfo.org
      });
    } else {
      this.getCountryByIpOnline().subscribe((res) => {
          console.log('This is your IP information: ', res );
          // put responce into storage so no nedded request it again on reload
          this.storage.store('geoIpInfo', res); 
          // update form data
          this.exampleForm.patchValue({
            countryName: res.country_name,
            city: res.city,
            zipCode: res.postal,
            companyName: geoIpInfo.org
          });  
      }, (err) => {
          this.exampleForm.patchValue({countryName: 'N/A', city: 'N/A', zipCode: 'N/A'});
      });
    }
  }

  // unsubscribe listener
  // ngOnDestroy(): void {
  //   this.myFormValueChanges$.unsubscribe();
  // }

  /** Save form data */
  save(model: any, isValid: boolean, e: any) {
    e.preventDefault();
    alert('Form data are: '+JSON.stringify(model));
    var data = JSON.stringify(model);

    for (let i in model) {
       // alert('Form data companyName: ' + model[i]);
    }
  }

  /** Get online geoIp information to pre-fill form fields country, city and zip  */
  private getCountryByIpOnline(): Observable<any> {
    return this.http.get('https://ipapi.co/json/')
        .map(this.extractData)
        .catch(this.handleError);
  }

  /** responce data extraction from http responce */
  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  /** handle error if geoIp service not available.  */
  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  countryChange() {
    // alert('countryChange');
    // alert('countryChange exampleForm = ' + this.exampleForm);
    // alert('countryChange exampleForm 1 = ' + this.exampleForm.get('country'));
    alert('countryChange exampleForm 1 = ' + this.exampleForm.get('country').value);

    

  }

}
