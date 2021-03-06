import '../styles/headings.css';
import '../styles/styles.scss';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatListModule,
  MatRadioModule,
  MatSidenavModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { HelgolandCachingModule } from '@helgoland/caching';
import { HelgolandControlModule } from '@helgoland/control';
import { ApiInterface, GetDataApiInterface, HelgolandCoreModule, Settings, SettingsService } from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandDatasetTableModule } from '@helgoland/depiction/dataset-table';
import { HelgolandDatasetlistModule } from '@helgoland/depiction/datasetlist';
import { HelgolandFavoriteModule } from '@helgoland/favorite';
import { HelgolandFlotModule } from '@helgoland/flot';
import { GeoSearch, NominatimGeoSearchService } from '@helgoland/map';
import { HelgolandMapControlModule } from '@helgoland/map/control';
import { HelgolandMapSelectorModule } from '@helgoland/map/selector';
import { HelgolandMapViewModule } from '@helgoland/map/view';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandPermalinkModule } from '@helgoland/permalink';
import { HelgolandPlotlyModule } from '@helgoland/plotly';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandTimeModule } from '@helgoland/time';
import { HelgolandTimeRangeSliderModule } from '@helgoland/time/time-range-slider';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { GraphLegendComponent } from 'demo/app/pages/graph-legend/graph-legend.component';
import { MapSelectorComponent } from 'demo/app/pages/map-selector/map-selector.component';
import { MapViewComponent } from 'demo/app/pages/map-view/map-view.component';
import { ProfileEntryComponent } from 'demo/app/pages/profile-entry/profile-entry.component';
import { TrajectoryComponent } from 'demo/app/pages/trajectory/trajectory.component';
import { environment } from 'environments/environment';

import { settings } from '../main.browser';
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { ROUTES } from './app.routes';
import { AppState } from './app.service';
import { GeometryViewComponent } from './components/geometry-view/geometry-view.component';
import { LocalSelectorImplComponent } from './components/local-selector/local-selector.component';
import { StyleModificationComponent } from './components/style-modification/style-modification.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { FlotGraphComponent } from './pages/flot-graph/flot-graph.component';
import { ListSelectionComponent } from './pages/list-selection/list-selection.component';
import { PermalinkComponent } from './pages/permalink/permalink.component';
import { PlotlyGraphComponent } from './pages/plotly-graph/plotly-graph.component';
import { ServiceFilterSelectorDemoPageComponent } from './pages/service-filter-selector/service-filter-selector.component';
import { ServiceSelectorComponent } from './pages/service-selector/service-selector.component';
import { TableComponent } from './pages/table/table.component';
import { TimeComponent } from './pages/time/time.component';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
  constructor() {
    super();
    this.setSettings(settings);
  }
}

const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
  {
    provide: ApiInterface,
    useClass: GetDataApiInterface
  },
  {
    provide: SettingsService,
    useClass: ExtendedSettingsService
  },
  {
    provide: GeoSearch,
    useClass: NominatimGeoSearchService
  }
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    LocalSelectorImplComponent,
    StyleModificationComponent,
    ServiceSelectorComponent,
    ListSelectionComponent,
    FlotGraphComponent,
    PlotlyGraphComponent,
    TableComponent,
    TimeComponent,
    FavoriteComponent,
    PermalinkComponent,
    ServiceFilterSelectorDemoPageComponent,
    MapSelectorComponent,
    MapViewComponent,
    ProfileEntryComponent,
    GraphLegendComponent,
    TrajectoryComponent,
    GeometryViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    MatSidenavModule,
    MatListModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    BrowserAnimationsModule,
    HelgolandSelectorModule,
    HelgolandCachingModule,
    HelgolandFlotModule,
    HelgolandCoreModule,
    HelgolandTimeModule,
    HelgolandFavoriteModule,
    HelgolandPermalinkModule,
    HelgolandControlModule,
    HelgolandMapSelectorModule,
    HelgolandMapControlModule,
    HelgolandMapViewModule,
    HelgolandModificationModule,
    HelgolandDatasetlistModule,
    HelgolandTimeRangeSliderModule,
    HelgolandD3Module,
    HelgolandDatasetTableModule,
    HelgolandPlotlyModule
  ],
  entryComponents: [
    StyleModificationComponent,
    GeometryViewComponent
  ],
  providers: [
    environment.ENV_PROVIDERS,
    APP_PROVIDERS
  ]
})
export class AppModule { }
