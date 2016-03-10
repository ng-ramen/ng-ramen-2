/// <reference path="../typings/browser.d.ts" />

import {
Component, View, enableProdMode,
} from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { bootstrap } from 'angular2/platform/browser';

import {FocusMe} from '../src/ng2-ramen';

@Component({
  selector: 'app'
})
@View({
  template: `
    <h1>NG RAMEN!</h1>
    <input #searchinput type="text" focusMe/>

  `,
  directives: [
    CORE_DIRECTIVES,
    FocusMe,
  ]
})
export class Demo {}

bootstrap(Demo);
