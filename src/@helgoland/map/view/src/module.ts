import { NgModule } from '@angular/core';
import { HelgolandMapModule } from '@helgoland/map';

import { GeometryMapViewerComponent } from './geometry-map-viewer/geometry-map-viewer.component';

@NgModule({
    declarations: [
        GeometryMapViewerComponent
    ],
    imports: [
        HelgolandMapModule
    ],
    exports: [
        GeometryMapViewerComponent
    ],
    providers: [
    ]
})
export class HelgolandMapViewModule { }
