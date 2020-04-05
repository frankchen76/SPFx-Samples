import * as React from 'react';
import styles from './LocationHero.module.scss';
import { ILocationHeroProps } from './ILocationHeroProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ILocationHeroState } from './ILocationHeroState';
import { Spinner, SpinnerSize, Stack, DocumentCard, DocumentCardImage, DocumentCardDetails, DocumentCardTitle, DocumentCardActivity, ImageFit, IDocumentCardActivityPerson, IStackStyles, IDocumentCardStyles, PrimaryButton, autobind } from 'office-ui-fabric-react';
import { TestImages } from '@uifabric/example-data';
import { sp } from "@pnp/sp";
import { ILocationMsg } from '../../../services/dynamicProperty/ILocationMsg';

import "reflect-metadata";
import { IPageItem, IPageService, mainContainer, TYPES } from '../../../services';
import { PropertyInject, InjectAutoInit } from '@ezcode/spfx-di/lib';

const people: IDocumentCardActivityPerson[] = [
  { name: 'Annie Lindqvist', profileImageSrc: TestImages.personaFemale },
  { name: 'Roko Kolar', profileImageSrc: '', initials: 'RK' },
  { name: 'Aaron Reid', profileImageSrc: TestImages.personaMale },
  { name: 'Christian Bergqvist', profileImageSrc: '', initials: 'CB' },
];
const cardStyles: IDocumentCardStyles = {
  root: {
    margin: 5
  },
};

@InjectAutoInit
export default class LocationHero extends React.Component<ILocationHeroProps, ILocationHeroState> {

  @PropertyInject({
    typeKey: TYPES.IPageService,
    container: mainContainer.Container
  })
  private _iPageService: IPageService;

  constructor(props: ILocationHeroProps) {
    super(props);
    this.state = {
      pages: undefined,
      loading: false
    };
  }

  public async componentDidMount() {
    await this._initComponent(this.props.location);
  }
  public async componentDidUpdate(prevProps: ILocationHeroProps, prevState: ILocationHeroState, snapshot: any) {
    if (this.props.location.location != prevProps.location.location) {
      await this._initComponent(this.props.location);
    }
  }

  private async _initComponent(location: ILocationMsg): Promise<void> {
    this.setState({ loading: true });
    const pages = await this._iPageService.getSitePages(location ? location.location : undefined);

    this.setState({
      loading: false,
      pages: pages
    });
    // const whereClause = location ? `<Query><Where><Eq><FieldRef Name='Location' /><Value Type='Choice'>${location.location}</Value></Eq></Where></Query>` : `<Query />`;
    // return sp.web.lists.getByTitle(this.SITEPAGELIB).renderListDataAsStream({
    //   ViewXml: `<View>${whereClause}</View>`
    // }).then(item => {
    //   let ret: IPageItem[] = item.Row.map(t => {
    //     return {
    //       id: t["ID"],
    //       title: t["Title"],
    //       thumbnailImage: t['BannerImageUrl'],
    //       url: t['FileRef']
    //     };
    //   });
    //   this.setState({ pages: ret, loading: false });
    // });
  }

  @autobind
  private _changeLocationHandler(): void {
    this.props.commandPublisher.message = {
      command: "showPanel",
      consumer: "LocationHero"
    };
  }

  private _renderDocumentCards(page: IPageItem): JSX.Element {
    return (
      <DocumentCard
        aria-label={
          'Document Card with image. How to make a good design. ' +
          'Last modified by Annie Lindqvist and 2 others in March 13, 2018.'
        }
        styles={cardStyles}
        onClickHref={page.url}
      >
        <DocumentCardImage height={200} width={320} imageFit={ImageFit.cover} imageSrc={page.thumbnailImage} />
        <DocumentCardDetails>
          <DocumentCardTitle title={page.title} shouldTruncate />
          <DocumentCardTitle title={this.props.location ? this.props.location.location : ''} shouldTruncate showAsSecondaryTitle />
        </DocumentCardDetails>
        <DocumentCardActivity activity="Modified March 13, 2018" people={people.slice(0, 3)} />
      </DocumentCard >
    );
  }

  public render(): React.ReactElement<ILocationHeroProps> {
    return (
      <div className={styles.locationHero}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <PrimaryButton text="Change Location" onClick={this._changeLocationHandler} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.column}>
              {
                this.state.loading ?
                  <Spinner label="loading..." size={SpinnerSize.large} />
                  :
                  <Stack wrap horizontal horizontalAlign='space-between' >
                    {
                      this.state.pages &&
                      this.state.pages.map(page => { return this._renderDocumentCards(page); })
                    }
                  </Stack>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
