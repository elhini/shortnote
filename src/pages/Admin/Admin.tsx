import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Users from '../../components/Users/Users';
import Settings from '../../components/Settings/Settings';
import AuthUtils from '../../utils/AuthUtils';
import './Admin.css';

interface TabPanelProps {
  children: React.ReactNode;
  tabID: string;
  activeTabID: string;
}

function TabPanel(props: TabPanelProps) {
    const { children, activeTabID, tabID } = props;
    return activeTabID === tabID ? <>{children}</> : <></>;
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
        'Users': <Users />, 
        'Settings': <Settings />
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