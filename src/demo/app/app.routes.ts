import { Routes } from '@angular/router';

import { FavoriteComponent } from './pages/favorite/favorite.component';
import { FlotGraphComponent } from './pages/flot-graph/flot-graph.component';
import { GraphLegendComponent } from './pages/graph-legend/graph-legend.component';
import { ListSelectionComponent } from './pages/list-selection/list-selection.component';
import { MapSelectorComponent } from './pages/map-selector/map-selector.component';
import { MapViewComponent } from './pages/map-view/map-view.component';
import { PermalinkComponent } from './pages/permalink/permalink.component';
import { PlotlyGraphComponent } from './pages/plotly-graph/plotly-graph.component';
import { ProfileEntryComponent } from './pages/profile-entry/profile-entry.component';
import { ServiceFilterSelectorDemoPageComponent } from './pages/service-filter-selector/service-filter-selector.component';
import { TableComponent } from './pages/table/table.component';
import { TimeComponent } from './pages/time/time.component';
import { TrajectoryComponent } from './pages/trajectory/trajectory.component';
import { ServiceSelectorComponent } from './pages/service-selector/service-selector.component';

export const ROUTES: Routes = [
  { path: 'service-selector', component: ServiceSelectorComponent },
  { path: 'map-selector', component: MapSelectorComponent },
  { path: 'map-view', component: MapViewComponent },
  { path: 'plotly-graph', component: PlotlyGraphComponent },
  { path: 'flot-graph', component: FlotGraphComponent },
  { path: 'service-filter-selector', component: ServiceFilterSelectorDemoPageComponent },
  { path: 'profile-entry', component: ProfileEntryComponent },
  { path: 'graph-legend', component: GraphLegendComponent },
  { path: 'time', component: TimeComponent },
  { path: 'trajectory', component: TrajectoryComponent },
  { path: 'permalink', component: PermalinkComponent },
  { path: 'table', component: TableComponent },
  { path: 'favorite', component: FavoriteComponent },
  { path: 'list-selection', component: ListSelectionComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];
