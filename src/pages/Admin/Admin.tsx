import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import UsersApiClient from '../../api-clients/users';
import SessionsApiClient from '../../api-clients/sessions';
import Users from '../../components/Users/Users';
import AuthUtils from '../../utils/AuthUtils';
import { User, Session } from '../../types/index';

interface TabPanelProps {
  children: React.ReactNode;
  tabID: string;
  activeTabID: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, activeTabID, tabID } = props;
    return activeTabID === tabID ? <>{children}</> : <></>;
}

function getUsersPromise() {
    return new Promise<User[]>((resolve, reject) => {
        new UsersApiClient().getAll((users: User[]) => resolve(users));
    });
}

function getSessionsPromise() {
    return new Promise<Session[]>((resolve, reject) => {
        new SessionsApiClient().getAll((sessions: Session[]) => resolve(sessions));
    });
}

export default function Admin() {
    const [currTabID, setCurrTabID] = React.useState('Users');

    if (!AuthUtils.isAdmin()){
        return 'This page needs admin session';
    }

    function handleChange(event: React.ChangeEvent<{}>, newTabID: string) {
        setCurrTabID(newTabID);
    }
    
    var tabComponents: {[key: string]: React.ReactNode} = {
        'Users': <Users promises={[getUsersPromise(), getSessionsPromise()]} />, 
        'Sessions': <>TODO: render sessions</>
    };
    var tabIDs = Object.keys(tabComponents);
    var tabs = tabIDs.map(tabID => <Tab label={tabID} value={tabID} key={tabID} />);
    var tabPanels = tabIDs.map(tabID => <TabPanel activeTabID={currTabID} tabID={tabID} key={tabID}>
        {tabComponents[tabID]}
    </TabPanel>);
    return (
        <div id="Admin">
            <Tabs value={currTabID} onChange={handleChange}>{tabs}</Tabs>
            {tabPanels}
        </div>
    );
}