import * as React from 'react';
import styles from './SampleWp.module.scss';
import { ISampleWpProps } from './ISampleWpProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton, autobind } from 'office-ui-fabric-react';
import "@pnp/polyfill-ie11";
import { sp, Web } from "@pnp/sp";

export default class SampleWp extends React.Component<ISampleWpProps, {}> {
    @autobind
    private _test1Handler() {
        alert('start');
        sp.web.select("Title").get().then(w => {
            alert(w.Title);
            console.log(`Web Title: ${w.Title}`);
        });
    }
    @autobind
    private _test2Handler() {
        let web = new Web("https://m365x725618.sharepoint.com/sites/FrankCommunication1");
        web.get().then(result => {
            alert(result.Title);
        });
    }

    public render(): React.ReactElement<ISampleWpProps> {
        return (
            <div className={styles.sampleWp}>
                <div className={styles.container}>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <span className={styles.title}>Welcome to SharePoint!</span>
                            <p className={styles.description}>{escape(this.props.description)}</p>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.column}>
                            <PrimaryButton text="Test1" onClick={this._test1Handler} />
                            <PrimaryButton text="Test2" onClick={this._test2Handler} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
