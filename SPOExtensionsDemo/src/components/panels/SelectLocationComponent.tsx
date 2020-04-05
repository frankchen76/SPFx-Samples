import * as ReactDOM from 'react-dom';
import * as React from 'react';

import { ChoiceGroup, IChoiceGroupOption, autobind, Spinner } from 'office-ui-fabric-react';

export interface SelectLocationComponentProps {
  selectedLocation?: string;
  onSelected: (location: string) => void;
}
export interface SelectLocationComponentState {
  locationOptions: IChoiceGroupOption[];
  selectedLocationOption: IChoiceGroupOption;
  loading: boolean;
}
export class SelectLocationComponent extends React.Component<SelectLocationComponentProps, SelectLocationComponentState> {
  private _options: IChoiceGroupOption[] = [
    {
      key: 'Redmond',
      text: 'Redmond'
    },
    {
      key: 'Seattle',
      text: 'Seattle'
      //checked: true
    },
    {
      key: 'Sammamish',
      text: 'Sammamish'
      //disabled: true
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      selectedLocationOption: undefined,
      locationOptions: [], //this._options,
      loading: false
    };
  }

  public componentDidMount() {
    this.setState({ loading: true });
    setTimeout(() => {
      const selectedOptions = this._options.filter(o => o.key == this.props.selectedLocation);
      this.setState({
        selectedLocationOption: selectedOptions && selectedOptions.length == 1 ? selectedOptions[0] : this._options[0],
        locationOptions: this._options,
        loading: false
      });

    }, 1000);
  }

  @autobind
  private _choiceOnChanged(option: IChoiceGroupOption) {
    const selectedTemplate = this.state.locationOptions.filter(item => item.key == option.key);
    if (selectedTemplate.length == 1) {
      this.props.onSelected(selectedTemplate[0].key);
      this.setState({
        selectedLocationOption: option
      });
    }
  }

  public render(): JSX.Element {
    return (
      <div>
        {
          this.state.loading ?
            <Spinner />
            :
            <ChoiceGroup
              label='Select a template'
              selectedKey={this.state.selectedLocationOption ? this.state.selectedLocationOption.key : null}
              options={this.state.locationOptions ? this.state.locationOptions : null}
              onChanged={this._choiceOnChanged}
            />
        }
      </div>

    );
  }
}
