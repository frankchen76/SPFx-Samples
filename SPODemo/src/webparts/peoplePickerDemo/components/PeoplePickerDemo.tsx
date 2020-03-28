import * as React from 'react';
import styles from './PeoplePickerDemo.module.scss';
import { IPeoplePickerDemoProps } from './IPeoplePickerDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { IBasePickerSuggestionsProps, NormalPeoplePicker, ValidationState } from 'office-ui-fabric-react/lib/Pickers';

import { cloneDeep } from '@microsoft/sp-lodash-subset';
import { people, mru } from '@uifabric/example-data';
import { IPeoplePickerDemoState } from './IPeoplePickerDemoState';
import { autobind, PrimaryButton } from 'office-ui-fabric-react';
import { Dialog } from '@microsoft/sp-dialog';

import "reflect-metadata";
import { IUserService, mainContainer, TYPES } from '../../../services';
import { PropertyInject, InjectAutoInit } from '@ezcode/spfx-di/lib';

@InjectAutoInit
export default class PeoplePickerDemo extends React.Component<IPeoplePickerDemoProps, IPeoplePickerDemoState> {

  @PropertyInject({
    typeKey: TYPES.GraphUserService,
    container: mainContainer.Container
  })
  private _userService: IUserService;

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
    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     let ret = new Array<IPersonaProps>();
    //     for (let i = 0; i < 5; i++) {
    //       ret.push(this.state.peopleList[i]);
    //     }
    //     resolve(ret);

    //   }, 2000);
    // });
    return this._userService.getSuggestedUsers().then(userItems => {
      return userItems.map(u => {
        return {
          text: u.displayName,
          secondaryText: u.jobTitle,
          imageUrl: u.photo
        };
      });
    });
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


  @autobind
  private _showResultHandler(): void {
    const msg = this.state.currentSelectedPeoples ? this.state.currentSelectedPeoples.map(p => p.text).join(',') : '<No selection>';
    Dialog.alert(msg);
  }
  @autobind
  private async _testHandler() {
    try {
      const base64 = await this._getPhoto();
      console.log(base64);
    } catch (error) {
      console.log(error);
    }

    // console.log(blob.toString('base64'));
    // console.log(blob);
  }
  private async _getPhoto(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this._userService.webPartContext.msGraphClientFactory.getClient().then(graphClient => {
        const url = '/users/e39c9514-6150-4f8f-94a8-bf39e65aee56-/photos/48x48/$value';
        return graphClient.api(url).responseType('blob').get();
      }).then(blob => {
        var reader = new FileReader();
        reader.onloadend = (): void => {
          resolve(reader.result.toString());
          //console.log(base64data);
        };
        reader.readAsDataURL(blob);
      }).catch(error => { reject(error); });
    });
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
          <div className={styles.row}>
            <div className={styles.column}>
              <PrimaryButton text="Show Result" onClick={this._showResultHandler} />
              <PrimaryButton text="Test" onClick={this._testHandler} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
