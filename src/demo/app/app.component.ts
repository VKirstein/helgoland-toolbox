import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { Component } from '@angular/core';
import { Language } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public languageList: Language[];

    constructor(
        translate: TranslateService
    ) {
        translate.setDefaultLang('en');
        translate.use('en');

        // necessary to load information on e.g. what 'medium' date format should look like in German etc.
        registerLocaleData(localeDe);

        this.languageList = [
            {
                label: 'Deutsch',
                code: 'de'
            },
            {
                label: 'English',
                code: 'en'
            }
        ];
    }
}
