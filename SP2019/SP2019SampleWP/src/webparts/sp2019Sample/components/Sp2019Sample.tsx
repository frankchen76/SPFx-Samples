import * as React from 'react';
import styles from './Sp2019Sample.module.scss';
import { ISp2019SampleProps } from './ISp2019SampleProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton, autobind, Spinner, SpinnerSize } from 'office-ui-fabric-react';
import { HttpClient, SPHttpClient, IHttpClientOptions } from '@microsoft/sp-http';
import { ISp2019SampleState } from './ISp2019SampleState';

import "@pnp/polyfill-ie11";
import { sp } from "@pnp/sp";

export default class Sp2019Sample extends React.Component<ISp2019SampleProps, ISp2019SampleState> {
  private _id: number;

  constructor(props: ISp2019SampleProps, state: ISp2019SampleState) {
    super(props);
    this.state = {
      loading: false,
      result: undefined
    };
  }

  @autobind
  private _testpnpjsHanlder(): void {
    sp.web.select("Title").get().then(w => {
      alert(w.Title);
      console.log(`Web Title: ${w.Title}`);
    });

  }

  @autobind
  private _testHanlder(): void {
    const url = 'https://localhost:44357/weatherforecast';
    //IHttpClientOptions
    this.setState({ loading: true });
    const options: IHttpClientOptions = {
      headers: new Headers(),
      method: 'GET',
      credentials: 'omit'
    };
    this.props.wpContext.httpClient
      .fetch(url, HttpClient.configurations.v1, options)
      .then(result => {
        result.json().then(obj => {
          this.setState({
            loading: false,
            result: JSON.stringify(obj, null, 4)
          });
          console.log(obj);
        });
      });
  }

  public render(): React.ReactElement<ISp2019SampleProps> {
    return (
      <div className={styles.sp2019Sample} >
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
              <p className={styles.description}>{escape(this.props.description)}</p>
              <PrimaryButton text='Test Service (NTLM)' onClick={this._testHanlder} />
              <PrimaryButton text='Test PnPJS' onClick={this._testpnpjsHanlder} />
              {this.state.loading &&
                <Spinner size={SpinnerSize.large} label='loading...' />
              }
            </div>
          </div>
          {this.state.result &&
            <div className={styles.row}>
              <div className={styles.columnResult}>
                {this.state.result}
              </div>
            </div>
          }
        </div>
      </div >
    );
  }
}
