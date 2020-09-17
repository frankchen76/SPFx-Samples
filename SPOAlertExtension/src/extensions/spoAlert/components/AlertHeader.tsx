import * as React from 'react';
import * as ReactDom from 'react-dom';
import styles from './AlertHeader.module.scss';
import { escape, cloneDeep } from '@microsoft/sp-lodash-subset';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { IAlert } from '../../../services/Alert/IAlert';
import { SPOAlertService } from '../../../services/Alert/SPOAlertService';
import {
  MessageBarButton,
  Link,
  Stack,
  MessageBar,
  MessageBarType,
  IStackItemStyles, IStyleFunctionOrObject, IMessageBarStyleProps, IMessageBarStyles
} from 'office-ui-fabric-react';

export interface IAlertHeaderProps {
  text: string;
  context: ApplicationCustomizerContext;
}

interface IAlertHeaderState {
  alerts: IAlert[];
}

export class AlertHeader extends React.Component<IAlertHeaderProps, IAlertHeaderState> {
  private _selectedLocation: string;
  constructor(props: IAlertHeaderProps) {
    super(props);
    this.state = {
      alerts: undefined
    };
  }

  public async componentDidMount() {
    try {
      let service = new SPOAlertService(this.props.context);
      let alerts = await service.getCurrentAlertsPnP();
      if (alerts) {
        alerts.forEach(item => item.Hide = false);
      }
      this.setState({ alerts: alerts });

    } catch (error) {
      console.log(error);
    }
  }
  private onDismissHandler(alter: IAlert) {
    this.setState((prevState, props) => {
      let newAlerts = cloneDeep(prevState.alerts);
      newAlerts.forEach(item => {
        if (item.ID == alter.ID) {
          item.Hide = true;
        }
      });
      return { alerts: newAlerts };
    });
  }

  // public render(): React.ReactElement<IAlertHeaderProps> {
  //   return (
  //     <MessageBar
  //       messageBarType={MessageBarType.error}
  //       isMultiline={false}
  //       dismissButtonAriaLabel="Close">
  //       this is test {this.state.alerts ? this.state.alerts.length.toString() : 'N/A'}
  //       <Link href='https://www.bing.com' target="_blank">
  //         More information.
  //   </Link>
  //     </MessageBar>
  //   );
  // }

  public render(): React.ReactElement<IAlertHeaderProps> {
    const stackItemStyle: IStackItemStyles = {
      root: {
        height: 30
      }
    };
    const messageBarStyle: IStyleFunctionOrObject<IMessageBarStyleProps, IMessageBarStyles> = {
      root: { height: 30 },
      text: { height: 30, marginTop: 5, marginBottom: 5 },
      iconContainer: { height: 30, marginTop: 5, marginBottom: 5 },
      dismissal: { height: 30, marginTop: 5, marginBottom: 5 }
    };
    const displayAlerts: IAlert[] = this.state.alerts ? this.state.alerts.filter(item => !item.Hide) : [];

    return (
      <Stack horizontal={false}>
        {displayAlerts && displayAlerts.map(alert => {
          return (
            <Stack.Item >
              <MessageBar
                messageBarType={MessageBarType[alert.AlertType]}
                styles={messageBarStyle}
                isMultiline={false}
                onDismiss={this.onDismissHandler.bind(this, alert)}
                dismissButtonAriaLabel="Close"
              >{alert.AlertMessage}
                {alert.MoreInformation && <Link href={alert.MoreInformation.Url} title={alert.MoreInformation.Description} target="_blank">More information.</Link>}
              </MessageBar>
            </Stack.Item>
          );
        })}
      </Stack>
    );
  }
}
