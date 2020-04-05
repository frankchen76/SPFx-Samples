import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Panel, ChoiceGroup, autobind, PanelType, PrimaryButton, DefaultButton, Stack } from 'office-ui-fabric-react';

export enum PanelResultEnum {
  Cancel = 0,
  Ok = 1
}
export interface IBasePanelOption {
  headerText?: string;
  closeButtonAriaLabel?: string;
  isFooterAtBottom?: boolean;
}
export abstract class BasePanel<T extends IBasePanelOption> {
  protected _domElement: HTMLElement;
  protected _isOpen: boolean;
  protected _currentResolve: (result: PanelResultEnum) => void;
  protected _option: T;

  constructor(option?: T) {
    this._domElement = document.createElement('div');
    this._option = option;
    if (!this._option.closeButtonAriaLabel) {
      this._option.closeButtonAriaLabel = this.defaultOptions.closeButtonAriaLabel;
    }
    if (!this._option.headerText) {
      this._option.headerText = this.defaultOptions.headerText;
    }
    if (!this._option.isFooterAtBottom) {
      this._option.isFooterAtBottom = this.defaultOptions.isFooterAtBottom;
    }
  }
  private get defaultOptions(): IBasePanelOption {
    return {
      headerText: '',
      closeButtonAriaLabel: 'Close',
      isFooterAtBottom: true
    };
  }

  public abstract render(): JSX.Element;

  @autobind
  protected renderFooterContent(): JSX.Element {
    const buttonStyles = { root: { marginRight: 8 } };
    return (
      <Stack horizontal horizontalAlign='space-evenly'>
        <PrimaryButton onClick={this._close.bind(this, PanelResultEnum.Ok)} styles={buttonStyles} text="Ok" />
        <DefaultButton onClick={this._close.bind(this, PanelResultEnum.Cancel)} text="Cancel" />
      </Stack>
    );
  }
  @autobind
  protected _renderPanel(): void {
    ReactDOM.render(<Panel
      headerText={this._option.headerText}
      closeButtonAriaLabel={this._option.closeButtonAriaLabel}
      isOpen={this._isOpen}
      onDismissed={this._close.bind(this, PanelResultEnum.Cancel)}
      onRenderFooterContent={this.renderFooterContent}
      isFooterAtBottom={this._option.isFooterAtBottom}>
      {this.render()}
    </Panel>
      , this._domElement);

  }

  protected onAfterClose(): void {
    ReactDOM.unmountComponentAtNode(this._domElement);
  }

  public show(): Promise<PanelResultEnum> {
    return new Promise<PanelResultEnum>((resolve, reject) => {
      this._isOpen = true;
      this._renderPanel();
      this._currentResolve = resolve;
    });
  }
  protected _close(panelResult: PanelResultEnum): void {
    this._isOpen = false;
    this._renderPanel();
    this.onAfterClose();
    if (this._currentResolve != null) {
      this._currentResolve(panelResult);
    }
  }
}
