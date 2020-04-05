import * as React from 'react';
import styles from './Header.module.scss';
import { IHeaderProps } from './IHeaderProps';
import { IHeaderState } from './IHeaderState';
import { escape } from '@microsoft/sp-lodash-subset';
import {
  PrimaryButton,
  DefaultButton,
  autobind,
  Button,
  Panel,
  PanelType,
  ChoiceGroup,
  IChoiceGroupOption
} from 'office-ui-fabric-react';



export default class SPFxHeader extends React.Component<IHeaderProps, IHeaderState> {
  private _selectedLocation: string;
  constructor(props: IHeaderProps) {
    super(props);
  }

  public componentDidMount() {
    console.log("Header");
  }

  public render(): React.ReactElement<IHeaderProps> {
    return (
      <div className={styles.spfxHeader1}>
        <PrimaryButton text="Change Location"
          onClick={() => { this.props.showLocationPanel(); }} />
      </div>

    );
  }
}
