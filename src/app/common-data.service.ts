import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

// import { Team } from './team';
import { ALL_SKILLS } from './common-data';

@Injectable()
export class CommonDataService {

  constructor() { }

  getSkills() {
	    return Observable.of(ALL_SKILLS);		
	}

}