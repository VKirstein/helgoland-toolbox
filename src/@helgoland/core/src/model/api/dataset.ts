import { Parameter } from './parameter';
import { Station } from './station';
import { DatasetTypes, PlatformTypes } from './enums';

export interface IDataset extends Parameter {
    url: string;
    uom: string;
    internalId: string;
    firstValue: FirstLastValue;
    lastValue: FirstLastValue;
    referenceValues: ReferenceValue[];
    parameters: ParameterConstellation;
}

export class ParameterConstellation {
    public service: Parameter;
    public offering: Parameter;
    public feature: Parameter;
    public procedure: Parameter;
    public phenomenon: Parameter;
    public category: Parameter;
}

export class FirstLastValue {
    public timestamp: number;
    public value: number;
}

export class ReferenceValue {
    public referenceValueId: string;
    public label: string;
    public lastValue: FirstLastValue;
    public color?: string;
    public visible?: boolean;
}

export class DatasetParameterConstellation extends ParameterConstellation {
    public platform: PlatformParameter;
}

export class Dataset implements IDataset {
    public id: string;
    public label: string;
    public url: string;
    public uom: string;
    public internalId: string;
    public firstValue: FirstLastValue;
    public lastValue: FirstLastValue;
    public referenceValues: ReferenceValue[];
    public datasetType: DatasetTypes;
    public platformType: PlatformTypes;
    public parameters: DatasetParameterConstellation;
    public seriesParameters?: DatasetParameterConstellation;
}

export class Timeseries implements IDataset {
    public id: string;
    public label: string;
    public url: string;
    public uom: string;
    public internalId: string;
    public firstValue: FirstLastValue;
    public lastValue: FirstLastValue;
    public referenceValues: ReferenceValue[];
    public station: Station;
    public parameters: ParameterConstellation;
    public hasData = false;
}

export interface TimeseriesExtras {
    license?: string;
    statusIntervals?: StatusInterval[];
}

export interface StatusInterval {
    lower: string;
    upper: string;
    name: string;
    color: string;
}

export interface PlatformParameter extends Parameter {
    platformType: PlatformTypes;
}
