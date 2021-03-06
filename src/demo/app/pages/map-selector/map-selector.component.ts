import { Component } from '@angular/core';
import { ParameterFilter, Phenomenon, Station } from '@helgoland/core';
import { GeoSearchOptions, LayerOptions } from '@helgoland/map';
import L from 'leaflet';

L.Marker.prototype.options.icon = L.icon({
    iconRetinaUrl: 'assets/img/marker-icon-2x.png',
    iconUrl: 'assets/img/marker-icon.png',
    shadowUrl: 'assets/img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

@Component({
    selector: 'my-app',
    templateUrl: './map-selector.component.html',
    styleUrls: ['./map-selector.component.css']
})
export class MapSelectorComponent {

    // public providerUrl = 'http://geo.irceline.be/sos/api/v1/';
    public providerUrl = 'http://mudak-wrm.dev.52north.org/sos/api/';

    public fitBounds: L.LatLngBoundsExpression = [[49.5, 3.27], [51.5, 5.67]];
    public fitBounds2: L.LatLngBoundsExpression = [[49.5, 3.27], [51.5, 5.67]];
    public zoomControlOptions: L.Control.ZoomOptions = { position: 'topleft' };
    public avoidZoomToSelection = false;
    public baseMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
    public overlayMaps: Map<string, LayerOptions> = new Map<string, LayerOptions>();
    public layerControlOptions: L.Control.LayersOptions = { position: 'bottomleft' };
    public cluster = false;
    public loadingStations: boolean;
    public stationFilter: ParameterFilter = {
        // phenomenon: '8'
    };
    public statusIntervals: boolean = false;
    public mapOptions: L.MapOptions = { dragging: true, zoomControl: false };

    public searchOptions: GeoSearchOptions = { countrycodes: [] };

    public addOverlayMapLayer() {
        this.overlayMaps = new Map<string, LayerOptions>();
        this.overlayMaps.set('pm10_24hmean_1x1',
            {
                label: 'pm10_24hmean_1x1',
                visible: true,
                layer: L.tileLayer.wms('http://geo.irceline.be/rio/wms', {
                    layers: 'pm10_hmean_1x1',
                    transparent: true,
                    format: 'image/png',
                    time: '2018-01-05T11:00:00.000Z',
                    opacity: 0.7,
                    tiled: true,
                    visibility: true,
                    pane: 'tilePane',
                    zIndex: -9998,
                    projection: 'EPSG:4326',
                    units: 'm'
                })
            });
        this.overlayMaps.set('realtime:o3_station_max',
            {
                label: 'realtime:o3_station_max',
                visible: true,
                layer: L.tileLayer.wms('http://geo.irceline.be/wms', {
                    layers: 'realtime:o3_station_max',
                    transparent: true,
                    format: 'image/png',
                    time: '2018-01-05T11:00:00.000Z',
                    visibility: false,
                    pane: 'tilePane',
                    zIndex: -9997,
                    projection: 'EPSG:4326',
                    units: 'm'
                })
            }
        );
    }

    public removeOverlayMapLayer() {
        this.overlayMaps = new Map<string, LayerOptions>();
    }

    public showZoomControlsRight() {
        this.zoomControlOptions = { position: 'topright' };
    }

    public showZoomControlsLeft() {
        this.zoomControlOptions = { position: 'topleft' };
    }

    public switchProvider() {
        if (this.providerUrl === 'http://geo.irceline.be/sos/api/v1/') {
            this.providerUrl = 'http://sensorweb.demo.52north.org/sensorwebclient-webapp-stable/api/v1/';
        } else {
            this.providerUrl = 'http://geo.irceline.be/sos/api/v1/';
        }
    }

    public zoomToOtherExtend() {
        this.fitBounds = [[39.5, 3.27], [41.5, 5.67]];
    }

    public onStationSelected(station: Station) {
        console.log('Clicked station: ' + station.properties.label);
    }

    public onSelectPhenomenon(phenomenon: Phenomenon) {
        console.log('Select: ' + phenomenon.label + ' with ID: ' + phenomenon.id);
        this.stationFilter = {
            phenomenon: phenomenon.id
        };
    }
}
