import * as React from 'react';
import * as ReactDom from 'react-dom';
import styles from './AlertHeader.module.scss';
import { escape, cloneDeep } from '@microsoft/sp-lodash-subset';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { SPOClassificationService } from '../../../services/Classification/SPOClassificationService';
import {
  MessageBarButton,
  Link,
  Stack,
  MessageBar,
  MessageBarType,
  IStackItemStyles, IStyleFunctionOrObject, IMessageBarStyleProps, IMessageBarStyles
} from 'office-ui-fabric-react';

export interface INotificationHeaderProps {
  context: ApplicationCustomizerContext;
}

interface INotificationHeaderState {
  classification: string;
  showNotification: boolean;
}

export class NotificationHeader extends React.Component<INotificationHeaderProps, INotificationHeaderState> {
  private _selectedLocation: string;
  constructor(props: INotificationHeaderProps) {
    super(props);
    this.state = {
      classification: undefined,
      showNotification: true
    };
  }

  public async componentDidMount() {
    try {
      let service = new SPOClassificationService(this.props.context);
      let classification = await service.getClassification();
      this.setState({ classification: classification });

    } catch (error) {
      console.log(error);
    }
  }
  private onDismissHandler = (): void => {
    this.setState({ showNotification: false });
  }

  public render(): React.ReactElement<INotificationHeaderProps> {
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

    return (
      <Stack horizontal={false}>
        {this.state.classification && this.state.showNotification &&
          <MessageBar
            messageBarType={MessageBarType.info}
            styles={messageBarStyle}
            isMultiline={false}
            onDismiss={this.onDismissHandler}
            dismissButtonAriaLabel="Close"
          >The current site collection's classification is {this.state.classification}, please do not include any PII data for this site collection. <Link href="https://m365x725618.sharepoint.com/sites/ContosoAssets/SitePages/UsageGuidelines.aspx" title="Usage Guideline" target="_blank">More information.</Link>
          </MessageBar>
        }
      </Stack>
    );
  }
}
