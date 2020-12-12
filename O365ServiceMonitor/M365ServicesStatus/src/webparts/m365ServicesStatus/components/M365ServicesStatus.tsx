import * as React from 'react';
import styles from './M365ServicesStatus.module.scss';
import { IM365ServicesStatusProps } from './IM365ServicesStatusProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DocumentCard, DocumentCardLogo, DocumentCardTitle, DocumentCardActivity, IDocumentCardStyles, IDocumentCardLogoProps, DocumentCardDetails } from 'office-ui-fabric-react';
import { IServiceStatus } from '../../../Services/M365ServiceStatus/IServiceStatus';
import { SPOStatusService } from '../../../Services/M365ServiceStatus/SPOStatusSerivce';

interface IM365ServicesStatusState {
  loading: boolean;
  services: IServiceStatus[];
}

export default class M365ServicesStatus extends React.Component<IM365ServicesStatusProps, IM365ServicesStatusState> {
  constructor(props: IM365ServicesStatusProps) {
    super(props);
    this.state = {
      loading: false,
      services: undefined
    };
  }
  public async componentDidMount() {
    const service = new SPOStatusService();
    this.setState({ loading: true });
    const result = await service.getServiceStatus();
    this.setState({ loading: false, services: result });
  }
  public render(): React.ReactElement<IM365ServicesStatusProps> {
    const cardStyles: IDocumentCardStyles = {
      root: { display: 'inline-block', marginRight: 20, width: 320 },
    };
    const cardRender = this.state.services && this.state.services.map(status => {
      const logoProps: IDocumentCardLogoProps = {
        logoIcon: `${status.Title}Logo`,
      };
      return (
        <DocumentCard
          styles={cardStyles}
          onClickHref="http://bing.com"
        >
          <DocumentCardLogo {...logoProps} />
          <DocumentCardDetails >
            <DocumentCardTitle
              title={status.Title}
              shouldTruncate
            />
            <DocumentCardTitle
              title={status.Status}
              shouldTruncate
              showAsSecondaryTitle
            />
            {/* <DocumentCardStatus statusIcon="attach" status="3 Attachments" /> */}
          </DocumentCardDetails>
          {/* <DocumentCardActivity activity="Sent March 13, 2018" people={people.slice(0, 3)} /> */}
        </DocumentCard>
      );
    });
    return (
      <div className={styles.m365ServicesStatus}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              {this.state.services && cardRender}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
