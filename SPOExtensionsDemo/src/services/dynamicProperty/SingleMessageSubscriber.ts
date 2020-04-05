import {
  IDynamicDataPropertyDefinition,
  IDynamicDataSource,
  IDynamicDataCallables
} from '@microsoft/sp-dynamic-data';
import { DynamicDataProvider } from '@microsoft/sp-component-base';
import { autobind } from 'office-ui-fabric-react';
import { BaseWebPartContext } from '@microsoft/sp-webpart-base';


export class SingleMessageSubscriberOld<T>{
  private _dynamicDataProvider: DynamicDataProvider;
  private _dynamicDataSource: IDynamicDataSource;
  private _dyanmicDataProperty: string;
  private _callback: (val: T) => void;

  constructor(dataProvider: DynamicDataProvider, dynamicDataSource: IDynamicDataSource, dynamicDataProperty: string, callback: (val: T) => void) {
    this._dyanmicDataProperty = dynamicDataProperty;
    this._dynamicDataSource = dynamicDataSource;
    this._dynamicDataProvider = dataProvider;
    this._callback = callback;
    this._dynamicDataProvider.registerPropertyChanged(this._dynamicDataSource.id, this._dyanmicDataProperty, this._dynamicDataCallback);
  }

  @autobind
  private _dynamicDataCallback(): void {
    const val = this._dynamicDataSource.getPropertyValue(this._dyanmicDataProperty);
    this._callback(val);
  }

}
export class SingleMessageSubscriber<T>{
  private _dataProvider: DynamicDataProvider;
  private _consumer: string;
  private _sourceId: string;
  private _dataProperty: string;
  private _callback: (val: T) => void;

  constructor(dataProvider: DynamicDataProvider, consumer: string, sourceId: string, dataProperty: string, callback: (val: T) => void) {
    this._dataProvider = dataProvider;
    this._consumer = consumer;
    this._sourceId = sourceId;
    this._dataProperty = dataProperty;
    this._callback = callback;

    this._registerDynamicData();
  }

  @autobind
  private _registerDynamicData() {
    this._dataProvider.registerAvailableSourcesChanged(() => {
      console.log(`context: ${this._consumer}; source changed`);
      this._registerDynamicDataEvent(this._dataProvider);
    });
    this._registerDynamicDataEvent(this._dataProvider);

  }

  @autobind
  private _registerDynamicDataEvent(dataProvider: DynamicDataProvider) {
    let sources = dataProvider.getAvailableSources();
    sources.forEach(source => {
      if (source.id.indexOf(this._sourceId) != -1) {
        console.log(`context: ${this._consumer}; source ${source.id} was registered.`);
        dataProvider.registerPropertyChanged(source.id, this._dataProperty, () => {
          this._callback(source.getPropertyValue(this._dataProperty));
        });
      }
    });
  }

}
