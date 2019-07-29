import React from 'react';
import { CircularProgress, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import SettingsApiClient from '../../api-clients/settings';
import { Setting } from '../../types/index';
import './Settings.css';

interface SettingsState {
    setting: Setting,
    loading: boolean,
    submitting: boolean
}

export default class Settings extends React.Component<{}, SettingsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            setting: {},
            loading: false,
            submitting: false
        };
    }

    componentDidMount() {
        new SettingsApiClient(this).getAll((settings: Setting[]) => {
            var setting = settings[0] || {};
            this.setState({setting});
        });
    }

    handleCheck(e: React.ChangeEvent<HTMLInputElement>) {
        var setting = Object.assign(this.state.setting, {notesFormManualSubmitEnabled: e.target.checked});
        new SettingsApiClient(this).update(setting, (setting: Setting) => {
            this.setState({setting});
        });
    }

    render(){
        return this.state.loading ? <CircularProgress /> : (
            <FormControl component="fieldset" id="notesSettingsForm">
                <FormLabel component="legend">Notes</FormLabel>
                <FormGroup>
                    <FormControlLabel
                        label='Manual form submit' 
                        control={
                            <Checkbox
                                onChange={e => this.handleCheck(e)}
                                checked={this.state.setting.notesFormManualSubmitEnabled || false}
                                disabled={this.state.submitting}
                            />
                        }
                    />
                </FormGroup>
            </FormControl>
        );
    }
}