import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { DatasetOptions, HasLoadableContent, Mixin, Time, TimeInterval, Timespan } from '@helgoland/core';

@Component({
    selector: 'n52-flot-overview-timeseries-graph',
    templateUrl: './flot-overview-timeseries-graph.component.html',
    styleUrls: ['./flot-overview-timeseries-graph.component.scss']
})
@Mixin([HasLoadableContent])
export class FlotOverviewTimeseriesGraphComponent implements OnChanges, AfterViewInit, HasLoadableContent {

    @Input()
    public datasetIds: string[];

    @Input()
    public datasetOptions: Map<string, DatasetOptions>;

    @Input()
    public graphOptions: any;

    @Input()
    public timeInterval: TimeInterval;

    @Input()
    public rangefactor: number;

    @Output()
    public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

    @Output()
    public onLoading: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    public isContentLoading: (loading: boolean) => void;

    public overviewTimespan: Timespan;

    private init = false;

    constructor(
        private timeSrvc: Time,
        private cd: ChangeDetectorRef
    ) { }

    public ngAfterViewInit(): void {
        this.rangefactor = this.rangefactor || 1;
        this.calculateOverviewRange();
        this.init = true;
        this.cd.detectChanges();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.timeInterval && this.init) {
            this.calculateOverviewRange();
        }
    }

    public timeChanged(timespan: Timespan) {
        this.onTimespanChanged.emit(timespan);
    }

    private calculateOverviewRange() {
        const timespan = this.timeSrvc.createTimespanOfInterval(this.timeInterval);
        this.overviewTimespan = this.timeSrvc.getBufferedTimespan(timespan, this.rangefactor);
        this.graphOptions.selection.range = {
            from: timespan.from,
            to: timespan.to
        };
    }
}
