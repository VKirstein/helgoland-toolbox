import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlacklistedService, ParameterFilter, Service } from '@helgoland/core';

import { ServiceSelectorService } from './service-selector.service';

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
    selector: 'n52-service-selector',
    templateUrl: './service-selector.component.html',
    styleUrls: ['./service-selector.component.scss']
})
export class ServiceSelectorComponent implements OnInit {

    @Input()
    public providerList: string[];

    @Input()
    public providerBlacklist: BlacklistedService[];

    @Input()
    public supportStations: boolean;

    @Input()
    public selectedService: Service;

    @Input()
    public filter: ParameterFilter;

    @Output()
    public onServiceSelected: EventEmitter<Service> = new EventEmitter<Service>();

    public services: Service[];
    public loadingCount = 0;

    constructor(
        protected serviceSelectorService: ServiceSelectorService
    ) { }

    public ngOnInit() {
        if (!this.filter) { this.filter = {}; }
        if (!this.providerBlacklist) { this.providerBlacklist = []; }
        const list = this.providerList;
        this.loadingCount = list.length;
        this.services = [];
        list.forEach((url) => {
            this.serviceSelectorService.fetchServicesOfAPI(url, this.providerBlacklist, this.filter)
                .subscribe((res) => {
                    this.loadingCount--;
                    if (res && res instanceof Array) {
                        res.forEach((entry) => {
                            if (entry.quantities.platforms > 0
                                || this.supportStations && entry.quantities.stations > 0) {
                                this.services.push(entry);
                            }
                        });
                    }
                    this.services.sort((a, b) => {
                        if (a.label < b.label) { return -1; }
                        if (a.label > b.label) { return 1; }
                        return 0;
                    });
                }, () => {
                    this.loadingCount--;
                });
        });
    }

    public isSelected(service: Service) {
        if (!this.selectedService) { return false; }
        return this.selectedService.id === service.id && this.selectedService.apiUrl === service.apiUrl;
    }

    public selectService(service: Service) {
        this.onServiceSelected.emit(service);
    }
}
