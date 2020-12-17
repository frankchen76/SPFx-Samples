import * as React from 'react';
import styles from './M365ServicesStatus.module.scss';
import { IM365ServicesStatusProps } from './IM365ServicesStatusProps';
import { escape, find } from '@microsoft/sp-lodash-subset';
import { DocumentCard, DocumentCardLogo, DocumentCardTitle, DocumentCardActivity, IDocumentCardStyles, IDocumentCardLogoProps, DocumentCardDetails, DetailsList, DetailsListLayoutMode, SelectionMode, FontIcon, mergeStyles } from 'office-ui-fabric-react';
import { IServiceStatus } from '../../../Services/M365ServiceStatus/IServiceStatus';
import { SPOStatusService } from '../../../Services/M365ServiceStatus/SPOStatusSerivce';

interface IM365ServicesStatusState {
  loading: boolean;
  services: IServiceStatus[];
}
interface IStatusIndicator {
  iconName: string;
  status: string;
  color: string;
}
interface IWorkloadIndicator {
  Workload: string;
  iconName: string;
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
    const statusIndicators: IStatusIndicator[] = [
      {
        status: "Investigating",
        iconName: "CircleStopSolid",
        color: "red"
      },
      {
        status: "RestoringService",
        iconName: "Refresh",
        color: "red"
      },
      {
        status: "ServiceRestored",
        iconName: "SkypeCircleCheck",
        color: "gray"
      },
      {
        status: "ServiceDegradation",
        iconName: "IncidentTriangle",
        color: "darkyellow"
      },
      {
        status: "ServiceOperational",
        iconName: "SkypeCircleCheck",
        color: "green"
      },
    ];
    const workloadIndicators: IWorkloadIndicator[] = [
      {
        Workload: "Bookings",
        iconName: "BookingsLogo"
      },
      {
        Workload: "DynamicsCRM",
        iconName: "Dynamics365Logo"
      },
      {
        Workload: "Exchange",
        iconName: "ExchangeLogo"
      },
      {
        Workload: "Forms",
        iconName: "OfficeFormsLogo"
      },
      {
        Workload: "Intune",
        iconName: "OfficeLogo"
      },
      {
        Workload: "kaizalamessagingservices",
        iconName: "KaizalaLogo"
      },
      {
        Workload: "Lync",
        iconName: "LyncLogo"
      },
      {
        Workload: "MicrosoftFlow",
        iconName: "MicrosoftFlowLogo"
      },
      {
        Workload: "MicrosoftFlowM365",
        iconName: "MicrosoftFlowLogo"
      },
      {
        Workload: "microsoftteams",
        iconName: "TeamsLogo"
      },
      {
        Workload: "MobileDeviceManagement",
        iconName: "MobileReport"
      },
      {
        Workload: "O365Client",
        iconName: "OfficeLogo"
      },
      {
        Workload: "officeonline",
        iconName: "OfficeLogo"
      },
      {
        Workload: "OneDriveForBusiness",
        iconName: "OneDriveLogo"
      },
      {
        Workload: "OrgLiveID",
        iconName: "Org"
      },
      {
        Workload: "OSDPPlatform",
        iconName: ""
      },
      {
        Workload: "Planner",
        iconName: "PlannerLogo"
      },
      {
        Workload: "PowerApps",
        iconName: "PowerAppsLogo"
      },
      {
        Workload: "PowerAppsM365",
        iconName: "PowerAppsLogo"
      },
      {
        Workload: "PowerBIcom",
        iconName: "PowerBILogo"
      },
      {
        Workload: "RMS",
        iconName: "OfficeLogo"
      },
      {
        Workload: "SharePoint",
        iconName: "SharePointLogo"
      },
      {
        Workload: "StaffHub",
        iconName: "MicrosoftStaffhubLogo"
      },
      {
        Workload: "Stream",
        iconName: "StreamLogo"
      },
      {
        Workload: "SwayEnterprise",
        iconName: "SwayLogo16"
      },
      {
        Workload: "yammer",
        iconName: "YammerLogo"
      }
    ];
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
    // const fileIconImg = {
    //   verticalAlign: 'middle',
    //   maxHeight: '16px',
    //   maxWidth: '16px',
    // };
    // const statusIcon = mergeStyles({
    //   color: 'green',
    //   height: 16,
    //   width: 16
    // });
    const listColumn = [
      {
        key: 'Icon',
        name: 'icon',
        minWidth: 16,
        maxWidth: 16,
        iconName: 'OfficeLogo',
        // iconClassName: fileIconImg,
        onRender: (item: IServiceStatus) => {
          const workloadIcon = mergeStyles({
            height: 16,
            width: 16
          });
          const r = find(workloadIndicators, i => i.Workload == item.Workload);
          return <FontIcon iconName={r ? r.iconName : ""} className={workloadIcon} />;
        }
      },
      {
        key: 'Title',
        name: 'Service',
        fieldName: 'WorkloadDisplayName',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      },
      {
        key: 'StatusDisplayName',
        name: 'Status',
        fieldName: 'StatusDisplayName',
        minWidth: 100,
        maxWidth: 200,
        isResizable: true,
        onRender: (item: IServiceStatus) => {
          const r = find(statusIndicators, i => i.status == item.Status);
          const statusIcon = mergeStyles({
            color: r ? r.color : '',
            height: 16,
            width: 16
          });
          return <div><FontIcon iconName={r ? r.iconName : ""} className={statusIcon} /><span>{item.StatusDisplayName}</span></div>;
        }
      },
      {
        key: 'StatusTime',
        name: 'Time',
        fieldName: 'StatusTime',
        minWidth: 100,
        maxWidth: 160,
        isResizable: true
      }
    ];
    const listRender = () => {
      return this.state.services &&
        <DetailsList
          items={this.state.services}
          columns={listColumn}
          selectionMode={SelectionMode.none}
          layoutMode={DetailsListLayoutMode.justified}
        />
        ;
    };

    return (
      <div className={styles.m365ServicesStatus}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              {this.state.services && listRender()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
