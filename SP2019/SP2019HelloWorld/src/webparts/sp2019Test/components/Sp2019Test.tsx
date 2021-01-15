import * as React from 'react';
import styles from './Sp2019Test.module.scss';
import { ISp2019TestProps } from './ISp2019TestProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Sp2019Test extends React.Component<ISp2019TestProps, {}> {
  public render(): React.ReactElement<ISp2019TestProps> {
    return(
      <div className={styles.sp2019Test}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <span className={styles.title}>Welcome to SharePoint!</span>
              <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
              <p className={styles.description}>{escape(this.props.description)}</p>
              <a href='https://aka.ms/spfx' className={styles.button}>
                <span className={styles.label}>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
