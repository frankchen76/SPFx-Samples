import * as React from 'react';
import styles from './SampleWp.module.scss';
import { ISampleWpProps } from './ISampleWpProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton, autobind } from 'office-ui-fabric-react';
import "@pnp/polyfill-ie11";
import { sp } from "@pnp/sp";

export default class SampleWp extends React.Component<ISampleWpProps, {}> {
    @autobind
    private _testHandler() {
        alert('start');
        sp.web.select("Title").get().then(w => {
            alert(w.Title);
            console.log(`Web Title: ${w.Title}`);
        });
        // sp.web.select("Title").then(w => {
        //     alert(w.Title);
        //     console.log(`Web Title: ${w.Title}`);
        // });
        //console.log("Test");
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
                            <PrimaryButton text="Test" onClick={this._testHandler} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
