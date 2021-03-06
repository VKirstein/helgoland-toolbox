import 'leaflet.markercluster';

import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, KeyValueDiffers } from '@angular/core';
import { ApiInterface, HasLoadableContent, Mixin, Platform } from '@helgoland/core';
import { MapCache } from '@helgoland/map';
import L from 'leaflet';

import { MapSelectorComponent } from '../map-selector.component';

@Component({
    selector: 'n52-platform-map-selector',
    templateUrl: '../map-selector.component.html',
    styleUrls: ['../map-selector.component.scss']
})
@Mixin([HasLoadableContent])
export class PlatformMapSelectorComponent extends MapSelectorComponent<Platform> implements OnChanges, AfterViewInit {

    @Input()
    public cluster: boolean;

    private markerFeatureGroup: L.FeatureGroup;

    constructor(
        private apiInterface: ApiInterface,
        protected mapCache: MapCache,
        protected cd: ChangeDetectorRef,
        protected differs: KeyValueDiffers
    ) {
        super(mapCache, differs, cd);
    }

    protected drawGeometries() {
        this.noResultsFound = false;
        this.isContentLoading(true);
        if (this.markerFeatureGroup) { this.map.removeLayer(this.markerFeatureGroup); }
        this.apiInterface.getPlatforms(this.serviceUrl, this.filter)
            .subscribe((res) => {
                if (this.cluster) {
                    this.markerFeatureGroup = L.markerClusterGroup({ animate: true });
                } else {
                    this.markerFeatureGroup = L.featureGroup();
                }
                if (res instanceof Array && res.length > 0) {
                    res.forEach((entry) => {
                        const marker = L.marker([entry.geometry.coordinates[1], entry.geometry.coordinates[0]]);
                        marker.on('click', () => {
                            this.onSelected.emit(entry);
                        });
                        this.markerFeatureGroup.addLayer(marker);
                    });
                    this.markerFeatureGroup.addTo(this.map);
                    this.zoomToMarkerBounds(this.markerFeatureGroup.getBounds());
                } else {
                    this.noResultsFound = true;
                }
                this.map.invalidateSize();
                this.isContentLoading(false);
            });
    }
}
