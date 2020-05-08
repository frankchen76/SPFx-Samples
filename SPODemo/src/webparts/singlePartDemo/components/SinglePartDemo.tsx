import * as React from 'react';
import styles from './SinglePartDemo.module.scss';
import { ISinglePartDemoProps } from './ISinglePartDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';

import "reflect-metadata";
import { ISPListService, mainContainer, TYPES } from '../../../services';
import { PropertyInject, InjectAutoInit } from '@ezcode/spfx-di/lib';
import { ISinglePartDemoState } from './ISinglePartDemoState';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode, Announced, autobind } from 'office-ui-fabric-react';
import { ITaskService } from '../../../services/task/ITaskService';

@InjectAutoInit
export default class SinglePartDemo extends React.Component<ISinglePartDemoProps, ISinglePartDemoState> {
  @PropertyInject({
    typeKey: TYPES.SPListService,
    container: mainContainer.Container
  })
  private _spListService: ISPListService;

  @PropertyInject({
    typeKey: TYPES.GraphTaskService,
    container: mainContainer.Container
  })
  private _taskService: ITaskService;

  private _columns: IColumn[] = [
    {
      key: 'column1',
      name: 'id',
      //className: classNames.fileIconCell,
      //iconClassName: classNames.fileIconHeaderIcon,
      ariaLabel: 'Column operations for File type, Press to sort on File type',
      iconName: 'Page',
      isIconOnly: true,
      fieldName: 'id',
      minWidth: 16,
      maxWidth: 16,
      isResizable: true,
      //onColumnClick: this._onColumnClick,
      // onRender: (item: IDocument) => {
      //   return <img src={item.iconName} className={classNames.fileIconImg} alt={item.fileType + ' file icon'} />;
      // }
    },
    {
      key: 'column2',
      name: 'title',
      fieldName: 'title',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      // onColumnClick: this._onColumnClick,
      data: 'string',
      isPadded: true
    },
    {
      key: 'column3',
      name: 'details',
      fieldName: 'details',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      // onColumnClick: this._onColumnClick,
      data: 'string',
      isPadded: true
    },
    {
      key: 'column4',
      name: 'dueDateTime',
      fieldName: 'dueDateTime',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isSorted: true,
      isSortedDescending: false,
      sortAscendingAriaLabel: 'Sorted A to Z',
      sortDescendingAriaLabel: 'Sorted Z to A',
      // onColumnClick: this._onColumnClick,
      data: 'Date',
      isPadded: true
    }
  ];

  // private _spColumns: IColumn[] = [
  //   {
  //     key: 'column1',
  //     name: 'File Type',
  //     //className: classNames.fileIconCell,
  //     //iconClassName: classNames.fileIconHeaderIcon,
  //     ariaLabel: 'Column operations for File type, Press to sort on File type',
  //     iconName: 'Page',
  //     isIconOnly: true,
  //     fieldName: 'ID',
  //     minWidth: 16,
  //     maxWidth: 16,
  //     //onColumnClick: this._onColumnClick,
  //     // onRender: (item: IDocument) => {
  //     //   return <img src={item.iconName} className={classNames.fileIconImg} alt={item.fileType + ' file icon'} />;
  //     // }
  //   },
  //   {
  //     key: 'column2',
  //     name: 'Name',
  //     fieldName: 'Title',
  //     minWidth: 210,
  //     maxWidth: 350,
  //     isRowHeader: true,
  //     isResizable: true,
  //     isSorted: true,
  //     isSortedDescending: false,
  //     sortAscendingAriaLabel: 'Sorted A to Z',
  //     sortDescendingAriaLabel: 'Sorted Z to A',
  //     // onColumnClick: this._onColumnClick,
  //     data: 'string',
  //     isPadded: true
  //   }
  // ];

  constructor(props: ISinglePartDemoProps) {
    super(props);
    this.state = {
      items: undefined,
      loading: false,
      message: "No items"
    };
  }

  public componentDidMount() {
    // this._initList(this.props.listTitle);
    this._initTask();
  }

  public componentDidUpdate(prevProps: ISinglePartDemoProps, prevState: ISinglePartDemoState, snapshot) {
    if (prevProps.listTitle != this.props.listTitle) {
      // this._initList(this.props.listTitle);
      this._initTask();
    }
  }

  @autobind
  private _initTask() {
    this.setState({ loading: true });
    this._taskService.getTasks()
      .then(result => {
        this.setState({
          loading: false,
          items: result,
          message: "loaded"
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          items: undefined,
          message: "No Items"
        });
      });

  }
  private _initList(listTitle: string) {
    this.setState({ loading: true });
    this._spListService.getListItems(listTitle)
      .then(result => {
        this.setState({
          loading: false,
          items: result,
          message: "loaded"
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          items: undefined,
          message: "No Items"
        });
      });

  }

  public render(): React.ReactElement<ISinglePartDemoProps> {
    return (
      <div className={styles.singlePartDemo}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              {this.state.message && <div>{this.state.message}</div>}
              {this.state.items &&
                <DetailsList
                  items={this.state.items}
                  compact={false}
                  columns={this._columns}
                  selectionMode={SelectionMode.none}
                  //getKey={this._getKey}
                  setKey="none"
                  layoutMode={DetailsListLayoutMode.justified}
                  isHeaderVisible={true}
                //onItemInvoked={this._onItemInvoked}
                />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
