import * as React from 'react';
import styles from './PeoplePickerDemo.module.scss';
import { IPeoplePickerDemoProps } from './IPeoplePickerDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { IBasePickerSuggestionsProps, NormalPeoplePicker, ValidationState } from 'office-ui-fabric-react/lib/Pickers';

import { cloneDeep } from '@microsoft/sp-lodash-subset';
import { people, mru } from '@uifabric/example-data';
import { IPeoplePickerDemoState } from './IPeoplePickerDemoState';
import { autobind } from 'office-ui-fabric-react';

export default class PeoplePickerDemo extends React.Component<IPeoplePickerDemoProps, IPeoplePickerDemoState> {
  private suggestionProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: 'Suggested People',
    mostRecentlyUsedHeaderText: 'Suggested Contacts',
    noResultsFoundText: 'No results found',
    loadingText: 'Loading',
    showRemoveButtons: true,
    suggestionsAvailableAlertText: 'People Picker Suggestions available',
    suggestionsContainerAriaLabel: 'Suggested contacts'
  };

  constructor(props) {
    super(props);
    let peopleData = cloneDeep(people);
    peopleData.forEach(p => p['primaryText'] = p['text']);
    this.state = {
      currentSelectedPeoples: null,
      peopleList: peopleData
    };

  }

  @autobind
  private _onFilterChanged(filterText: string, currentPersonas: IPersonaProps[], limitResults?: number): IPersonaProps[] | Promise<IPersonaProps[]> {
    if (filterText) {
      let filteredPersonas: IPersonaProps[] = this._filterPersonasByText(filterText);

      return filteredPersonas;
    } else {
      return [];
    }
  }
  private _filterPersonasByText(filterText: string): IPersonaProps[] {
    return this.state.peopleList.filter(item => this._doesTextStartWith(item["text"] as string, filterText));
  }
  private _doesTextStartWith(text: string, filterText: string): boolean {
    return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
  }
  private _getTextFromItem(persona: IPersonaProps): string {
    return persona['text'] as string;
  }
  @autobind
  private _returnMostRecentlyUsed(currentPersonas: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> {
    // let { mostRecentlyUsed } = this.state;
    // mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersonas);
    let ret = new Array<IPersonaProps>();
    for (let i = 0; i < 5; i++) {
      ret.push(this.state.peopleList[i]);
    }
    return ret;
  }

  @autobind
  private _onPeoplePickerChange(items: IPersonaProps[]): void {
    this.setState({
      currentSelectedPeoples: items
    });
  }

  private _onInputChange(input: string): string {
    const outlookRegEx = /<.*>/g;
    const emailAddress = outlookRegEx.exec(input);

    if (emailAddress && emailAddress[0]) {
      return emailAddress[0].substring(1, emailAddress[0].length - 1);
    }

    return input;
  }

  public render(): React.ReactElement<IPeoplePickerDemoProps> {
    return (
      <div className={styles.peoplePickerDemo}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              <NormalPeoplePicker
                onResolveSuggestions={this._onFilterChanged}
                onEmptyInputFocus={this._returnMostRecentlyUsed}
                getTextFromItem={this._getTextFromItem}
                pickerSuggestionsProps={this.suggestionProps}
                selectedItems={this.state.currentSelectedPeoples}
                onChange={this._onPeoplePickerChange}
                className={'ms-PeoplePicker'}
                key={'normal'}
                removeButtonAriaLabel={'Remove'}
                inputProps={{
                  onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
                  onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
                  'aria-label': 'People Picker'
                }}
                onInputChange={this._onInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
