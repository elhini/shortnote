import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import SettingsApiClient from '../../api-clients/settings';
import { Setting } from '../../types/index';

interface SettingsState {
    setting: Setting,
    loading: boolean
}

export default class Settings extends React.Component<{}, SettingsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            setting: {},
            loading: false
        };
    }

    componentDidMount() {
        this.setState({loading: true});
        new SettingsApiClient().getAll((settings: Setting[]) => {
            var setting = settings[0] || {};
            this.setState({loading: false, setting});
        });
    }

    handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
        var setting = this.state.setting;
        setting.notesFormManualSubmitEnabled = e.target.checked;
        new SettingsApiClient().update(setting, (setting: Setting) => {
            this.setState({setting});
        });
    }

    render(){
        return this.state.loading ? 'loading...' : (
            <form>
                <label>
                    Notes form manual submit: 
                    <Checkbox
                        onChange={e => this.handleCheck(e)}
                        checked={this.state.setting.notesFormManualSubmitEnabled}
                    />
                </label>
            </form>
        );
    }
}