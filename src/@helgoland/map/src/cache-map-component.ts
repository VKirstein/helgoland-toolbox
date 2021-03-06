import { DoCheck, Input, KeyValueDiffer, KeyValueDiffers, OnChanges, SimpleChanges } from '@angular/core';
import L from 'leaflet';

import { MapCache } from './map-cache.service';
import { LayerOptions } from './map-options';

const DEFAULT_BASE_LAYER_NAME = 'BaseLayer';
const DEFAULT_BASE_LAYER_URL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const DEFAULT_BASE_LAYER_ATTRIBUTION = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

export abstract class CachedMapComponent implements OnChanges, DoCheck {

    /**
     * @input A map with the given ID is created inside this component. This ID can be used outside of the component the
     * work with the map.
     *
     * @memberof MapSelectorComponent
     */
    @Input()
    public mapId: string;

    @Input()
    public mapOptions: L.MapOptions;

    @Input()
    public fitBounds: L.LatLngBoundsExpression;

    @Input()
    public overlayMaps: Map<string, LayerOptions>;

    @Input()
    public baseMaps: Map<string, LayerOptions>;

    @Input()
    public layerControlOptions: L.Control.LayersOptions;

    @Input()
    public zoomControlOptions: L.Control.ZoomOptions;

    /**
     * The map object.
     *
     * @protected
     * @memberof MapSelectorComponent
     */
    protected map: L.Map;

    protected oldOverlayLayer: L.Control.LayersObject = {};
    protected oldBaseLayer: L.Control.LayersObject = {};
    protected layerControl: L.Control.Layers;
    protected zoomControl: L.Control.Zoom;

    private _overlayMaps: Map<string, LayerOptions>;
    private _differOverlayMaps: KeyValueDiffer<string, LayerOptions>;
    private _baseMaps: Map<string, LayerOptions>;
    private _differBaseMaps: KeyValueDiffer<string, LayerOptions>;

    constructor(
        protected mapCache: MapCache,
        protected differs: KeyValueDiffers
    ) {
        this._differOverlayMaps = this.differs.find({}).create();
        this._differBaseMaps = this.differs.find({}).create();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.map) {
            if (changes.fitBounds) {
                this.map.fitBounds(this.fitBounds);
            }
            if (changes.zoomControlOptions) {
                this.updateZoomControl();
            }
        }
    }

    public ngDoCheck(): void {
        if (this._differOverlayMaps) {
            const changes = this._differOverlayMaps.diff(this.overlayMaps);
            if (changes) {
                changes.forEachAddedItem((e) => this.addOverlayMap(e.currentValue));
                changes.forEachRemovedItem((e) => this.removeOverlayMap(e.currentValue));
                this.updateLayerControl();
            }
        }
        if (this._differBaseMaps) {
            const changes = this._differBaseMaps.diff(this.baseMaps);
            if (changes) {
                changes.forEachAddedItem((e) => this.addBaseMap(e.currentValue));
                changes.forEachRemovedItem((e) => this.removeBaseMap(e.currentValue));
                this.updateLayerControl();
            }
        }
    }

    protected createMap(): void {
        if (!this.mapOptions || this.zoomControlOptions) { this.mapOptions = { zoomControl: false }; }
        this.map = L.map(this.mapId, this.mapOptions);
        this.mapCache.setMap(this.mapId, this.map);
        if (this.baseMaps && this.baseMaps.size > 0) {
            this.baseMaps.forEach((entry, key) => this.addBaseMap(entry));
        } else {
            this.addBaseMap();
        }
        if (this.overlayMaps) { this.overlayMaps.forEach((entry, key) => this.addOverlayMap(entry)); }
        this.updateZoomControl();
        this.updateLayerControl();
        if (this.fitBounds) {
            this.map.fitBounds(this.fitBounds);
        }
    }

    private addOverlayMap(layerOptions: LayerOptions) {
        if (this.map) {
            if (!this.oldOverlayLayer.hasOwnProperty[layerOptions.label]) {
                this.oldOverlayLayer[layerOptions.label] = layerOptions.layer;
                if (layerOptions.visible) { layerOptions.layer.addTo(this.map); }
            }
        }
    }

    private removeOverlayMap(layerOptions: LayerOptions) {
        if (this.oldOverlayLayer.hasOwnProperty(layerOptions.label)) {
            this.map.removeLayer(this.oldOverlayLayer[layerOptions.label]);
            delete this.oldOverlayLayer[layerOptions.label];
        }
    }

    private addBaseMap(layerOptions?: LayerOptions) {
        if (this.map) {
            if (!this.baseMaps || this.baseMaps.size === 0) {
                layerOptions = {
                    label: DEFAULT_BASE_LAYER_NAME,
                    visible: true,
                    layer: L.tileLayer(DEFAULT_BASE_LAYER_URL, {
                        attribution: DEFAULT_BASE_LAYER_ATTRIBUTION
                    })
                };
            }
            if (!this.oldBaseLayer.hasOwnProperty[layerOptions.label]) {
                this.oldBaseLayer[layerOptions.label] = layerOptions.layer;
                if (layerOptions.visible) { layerOptions.layer.addTo(this.map); }
            }
        }
    }

    private removeBaseMap(layerOptions: LayerOptions) {
        if (this.oldBaseLayer.hasOwnProperty(layerOptions.label)) {
            this.map.removeLayer(this.oldBaseLayer[layerOptions.label]);
            delete this.oldBaseLayer[layerOptions.label];
        }
    }

    private updateLayerControl() {
        if (this.map) {
            if (this.layerControl) {
                this.map.removeControl(this.layerControl);
            }
            if (this.layerControlOptions
                && (Object.keys(this.oldBaseLayer).length > 1 || Object.keys(this.oldOverlayLayer).length > 0)) {
                this.layerControl =
                    L.control.layers(this.oldBaseLayer, this.oldOverlayLayer, this.layerControlOptions).addTo(this.map);
            }
        }
    }

    private updateZoomControl() {
        if (this.zoomControl) { this.map.removeControl(this.zoomControl); }
        if (this.zoomControlOptions) {
            this.zoomControl = L.control.zoom(this.zoomControlOptions).addTo(this.map);
        }
    }
}
