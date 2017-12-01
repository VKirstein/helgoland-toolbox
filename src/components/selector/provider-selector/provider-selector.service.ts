import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { ParameterFilter } from './../../../model/api/parameterFilter';
import { Service } from './../../../model/api/service';
import { BlacklistedService } from './../../../model/settings/settings';
import { ApiInterface } from './../../../services/api-interface/api-interface';

@Injectable()
export class ProviderSelectorService {

    constructor(
        private apiInterface: ApiInterface
    ) { }

    public fetchProvidersOfAPI(
        url: string,
        blacklist: BlacklistedService[],
        filter: ParameterFilter
    ): Observable<Service[]> {
        return new Observable<Service[]>((observer: Observer<Service[]>) => {
            this.apiInterface.getServices(url, filter)
                .subscribe((providers) => {
                    if (providers && providers instanceof Array) {
                        const usableProviders = providers.map((provider) => {
                            if (!this.isServiceBlacklisted(provider.id, url, blacklist)) {
                                return provider;
                            }
                        });
                        observer.next(usableProviders);
                        observer.complete();
                    }
                }, (error) => {
                    observer.error(error);
                    observer.complete();
                });
        });
    }

    private isServiceBlacklisted(serviceID: string, url: string, blacklist: BlacklistedService[]): boolean {
        let isBlacklisted = false;
        blacklist.forEach((entry) => {
            if (entry.serviceId === serviceID && entry.apiUrl === url) {
                isBlacklisted = true;
            }
        });
        return isBlacklisted;
    }
}
