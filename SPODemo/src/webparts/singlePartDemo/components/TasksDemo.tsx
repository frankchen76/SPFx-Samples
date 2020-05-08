import * as React from 'react';
import styles from './SinglePartDemo.module.scss';
import { ISinglePartDemoProps } from './ISinglePartDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';

import "reflect-metadata";
import { ISPListService, mainContainer, TYPES, ITaskItem } from '../../../services';
import { PropertyInject, InjectAutoInit } from '@ezcode/spfx-di/lib';
import { ISinglePartDemoState } from './ISinglePartDemoState';
import { DetailsList, IColumn, SelectionMode, DetailsListLayoutMode, Announced, autobind, FocusZone, List, FocusZoneDirection, Checkbox } from 'office-ui-fabric-react';
import { ITaskService } from '../../../services/task/ITaskService';

export interface ITasksDemoProps {
  listTitle: string;
}

export interface ITasksDemoState {
  items: ITaskItem[];
  loading: boolean;
  message: string;
}

@InjectAutoInit
export class TasksDemo extends React.Component<ITasksDemoProps, ITasksDemoState> {
  @PropertyInject({
    typeKey: TYPES.GraphTaskService,
    container: mainContainer.Container
  })
  private _taskService: ITaskService;

  constructor(props: ITasksDemoProps) {
    super(props);
    this.state = {
      items: undefined,
      loading: false,
      message: "No items"
    };
  }

  public async componentDidMount(): Promise<void> {
    // this._initList(this.props.listTitle);
    await this._initTask();
  }

  // public componentDidUpdate(prevProps: ISinglePartDemoProps, prevState: ISinglePartDemoState, snapshot) {
  //   if (prevProps.listTitle != this.props.listTitle) {
  //     // this._initList(this.props.listTitle);
  //     this._initTask();
  //   }
  // }

  @autobind
  private async _initTask(): Promise<void> {
    try {
      this.setState({ loading: true });
      const result = await this._taskService.getTasks();
      this.setState({
        loading: false,
        items: result,
        message: "loaded"
      });

    } catch (error) {
      this.setState({
        loading: false,
        message: error
      });

    }

  }

  @autobind
  private _onRenderCell(item: ITaskItem, index: number, isScrolling: boolean): JSX.Element {
    return (
      <div className="ms-grid">
        <div className="ms-row">
          <div className="ms-Grid-col ms-md12 ms-lg12 ms-sm12">
            <Checkbox label={item.title} />
          </div>
          <div className="ms-Grid-col ms-md12 ms-lg12 ms-sm12">{item.details}
          </div>
        </div>
      </div>

      // <div data-is-focusable={true}>
      //   <div className={classNames.itemContent}>
      //     <div className={classNames.itemName}>{item.name}</div>
      //     <div className={classNames.itemIndex}>{`Item ${index}`}</div>
      //   </div>
      // </div>
    );
  }
  public render(): React.ReactElement<ISinglePartDemoProps> {
    return (
      <div className={styles.singlePartDemo}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              {this.state.message && <div>{this.state.message}</div>}
              {this.state.items &&
                <FocusZone direction={FocusZoneDirection.vertical}>
                  <div data-is-scrollable={true}>
                    <List items={this.state.items} onRenderCell={this._onRenderCell} />
                  </div>
                </FocusZone>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
