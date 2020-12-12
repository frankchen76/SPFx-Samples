import * as React from 'react';
import * as ReactDom from 'react-dom';
// import styles from './AlertHeader.module.scss';
import { escape, cloneDeep } from '@microsoft/sp-lodash-subset';
import { ApplicationCustomizerContext } from '@microsoft/sp-application-base';
import { SPOPrivacyService } from '../../../services/Privacy/SPOPrivacyService';
import {
  MessageBarButton,
  Link,
  PrimaryButton,
  Stack,
  MessageBar,
  MessageBarType,
  IStackItemStyles, IStyleFunctionOrObject, IMessageBarStyleProps, IMessageBarStyles
} from 'office-ui-fabric-react';

export interface INotificationHeaderProps {
  context: ApplicationCustomizerContext;
  message: string;
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
      showNotification: false
    };
  }

  public async componentDidMount() {
    try {
      let service = new SPOPrivacyService(this.props.context);
      let isOwner = await service.isOwner();

      let classification: string = null;
      let showNotification = isOwner;
      if (isOwner) {
        const group = await service.getCurrentGroup();
        classification = group ? group.visibility : null;
        showNotification = classification == "Public";
      }

      this.setState({
        classification: classification,
        showNotification: showNotification
      });
    } catch (error) {
      console.log(error);
      this.setState({ showNotification: false });
    }
  }
  private onDismissHandler = (): void => {
    this.setState({ showNotification: false });
  }

  public render(): React.ReactElement<INotificationHeaderProps> {
    // const stackItemStyle: IStackItemStyles = {
    //   root: {
    //     height: 30
    //   }
    // };
    // const messageBarStyle: IStyleFunctionOrObject<IMessageBarStyleProps, IMessageBarStyles> = {
    //   root: { height: 30 },
    //   text: { height: 30, marginTop: 5, marginBottom: 5 },
    //   iconContainer: { height: 30, marginTop: 5, marginBottom: 5 },
    //   dismissal: { height: 30, marginTop: 5, marginBottom: 5 }
    // };
    const messageBarStyle: IStyleFunctionOrObject<IMessageBarStyleProps, IMessageBarStyles> = {
      text: { fontSize: 14 }
    };

    return (
      <Stack horizontal={false}>
        {this.state.showNotification &&
          <MessageBar
            actions={
              <div>
                <MessageBarButton onClick={this.onDismissHandler}>Acknowledge</MessageBarButton>
              </div>
            }
            messageBarType={MessageBarType.warning}
            styles={messageBarStyle}
            isMultiline={true}
          ><b>Please be aware</b> the data sensitivity field has been modified from Private to Public.  This allows all users in the Guardian environment to, at minimum read any file in the folder.  If you have sensitive data (i.e. PII, PHI, PFI, restricted) in any of these files you are in violation of corporate policy, If you require this folder to remain Public, please remove immediately. Otherwise revert the disposition from Public back to Private. Please note that Private will allow members of your group to gain or maintain access.
          </MessageBar>
        }
      </Stack>
    );
  }
}
