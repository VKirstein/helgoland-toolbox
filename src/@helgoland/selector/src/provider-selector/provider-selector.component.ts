import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Service } from '@helgoland/core';
import { ParameterFilter } from '@helgoland/core';
import { BlacklistedService } from '@helgoland/core';

import { ProviderSelectorService } from './provider-selector.service';

/**
 * Component to select an item out of a list of provider with a given filter combination.
 */
@Component({
    selector: 'n52-provider-selector',
    templateUrl: './provider-selector.component.html',
    styleUrls: ['./provider-selector.component.scss']
})
export class ProviderSelectorComponent implements OnInit {

    @Input()
    public providerList: string[];

    @Input()
    public providerBlacklist: BlacklistedService[];

    @Input()
    public supportStations: boolean;

    @Input()
    public selectedProvider: Service;

    @Input()
    public filter: ParameterFilter;

    @Output()
    public onProviderSelected: EventEmitter<Service> = new EventEmitter<Service>();

    public providers: Service[];
    public loadingCount = 0;

    constructor(
        private providerSelectorService: ProviderSelectorService
    ) { }

    public ngOnInit() {
        if (!this.filter) { this.filter = {}; }
        if (!this.providerBlacklist) { this.providerBlacklist = []; }
        const list = this.providerList;
        this.loadingCount = list.length;
        this.providers = [];
        list.forEach((url) => {
            this.providerSelectorService.fetchProvidersOfAPI(url, this.providerBlacklist, this.filter)
                .subscribe((res) => {
                    this.loadingCount--;
                    if (res && res instanceof Array) {
                        res.forEach((entry) => {
                            if (entry.quantities.platforms > 0
                                || this.supportStations && entry.quantities.stations > 0) {
                                this.providers.push(entry);
                            }
                        });
                    }
                    this.providers.sort((a, b) => {
                        if (a.label < b.label) { return -1; }
                        if (a.label > b.label) { return 1; }
                        return 0;
                    });
                }, () => {
                    this.loadingCount--;
                });
        });
    }

    public isSelected(provider: Service) {
        if (!this.selectedProvider) { return false; }
        return this.selectedProvider.id === provider.id && this.selectedProvider.providerUrl === provider.providerUrl;
    }

    public selectProvider(provider: Service) {
        this.onProviderSelected.emit(provider);
    }
}