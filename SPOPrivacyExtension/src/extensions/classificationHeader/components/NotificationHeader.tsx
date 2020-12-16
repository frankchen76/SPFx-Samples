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
    const htmlContent = { __html: this.props.message };

    return (
      <Stack horizontal={false}>
        {this.state.showNotification &&
          <MessageBar
            // actions={
            //   <div>
            //     <MessageBarButton onClick={this.onDismissHandler}>Acknowledge</MessageBarButton>
            //   </div>
            // }
            messageBarType={MessageBarType.warning}
            styles={messageBarStyle}
            isMultiline={true}
          ><div dangerouslySetInnerHTML={htmlContent}></div>
          </MessageBar>
        }
      </Stack>
    );
  }
}
