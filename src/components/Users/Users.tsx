import React from 'react';
import { CircularProgress, Table, TableHead, TableBody, TableRow, TableCell, IconButton } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import DeleteIcon from '@material-ui/icons/Delete';
import UsersApiClient from '../../api-clients/users';
import SessionsApiClient from '../../api-clients/sessions';
import DateUtils from '../../utils/DateUtils';
import _ from 'lodash';
import { User, Session } from '../../types/index';
import './Users.css';

type UsersPromises = [Promise<User[]>, Promise<Session[]>];

interface UsersState {
    users: User[],
    sessionsByUser: {[userID: string]: Session[]},
    loading: boolean,
    updatingUserID: string | null
}

type UserAction = 'block' | 'unblock' | 'delete';

function getUsersPromise(cmp: React.Component) {
    return new Promise<User[]>((resolve, reject) => {
        new UsersApiClient(cmp).getAll((users: User[]) => resolve(users));
    });
}

function getSessionsPromise(cmp: React.Component) {
    return new Promise<Session[]>((resolve, reject) => {
        new SessionsApiClient(cmp).getAll((sessions: Session[]) => resolve(sessions));
    });
}

export default class Users extends React.Component<{}, UsersState> {
    usersAPIClient: UsersApiClient;

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            sessionsByUser: {},
            loading: false,
            updatingUserID: null
        }
        this.usersAPIClient = new UsersApiClient(this);
    }

    componentDidMount() {
        var promises: UsersPromises = [getUsersPromise(this), getSessionsPromise(this)];
        Promise.all(promises).then((result) => {
            var users = result[0];
            var sessionsByUser = _.groupBy(result[1], s => s.userID);
            this.setState({users, sessionsByUser});
        });
    }

    onControlClick(user: User, action: UserAction){
        if (['block', 'unblock'].includes(action)){
            this.setState({updatingUserID: user._id || ''});
            user.blocked = action === 'block';
            this.usersAPIClient.update(user, (user: User) => {
                var users = this.state.users.filter(u => u._id !== user._id);
                users.push(user);
                this.setState({updatingUserID: null, users: users});
            });
        }
        if (action === 'delete'){
            if (!window.confirm('Delete this user?')){
                return;
            }
            this.setState({updatingUserID: user._id || ''});
            this.usersAPIClient.remove(user, () => {
                var users = this.state.users.filter(u => u._id !== user._id);
                this.setState({updatingUserID: null, users: users});
            });
        }
    }
    
    renderActionBtn(user: User, action: UserAction, title: string, disabled: boolean, icon: React.ReactNode){
        return ( 
            <IconButton onClick={e => this.onControlClick(user, action)} className={'actionBtn'} title={title} disabled={disabled}>
                {icon}
            </IconButton>
        );
    }
    
    renderActionBtns(user: User, disabled: boolean){
        var blockBtn = this.renderActionBtn(user, 'block', 'Block', disabled, <BlockIcon />);
        var unblockBtn = this.renderActionBtn(user, 'unblock', 'Unblock', disabled, <BlockIcon color="error" />);
        var deleteBtn = this.renderActionBtn(user, 'delete', 'Delete', disabled, <DeleteIcon />);
        return (<>
            {user.blocked ? unblockBtn : blockBtn}
            {deleteBtn}
        </>);
    }

    renderTableRow(user: User){
        var userSessions = this.state.sessionsByUser[user._id || ''];
        var activeSessions = userSessions.filter(s => s.active && s.expireDate > new Date().toISOString());
        var disabled = user._id === this.state.updatingUserID;
        return (
            <TableRow key={user._id}>
                <TableCell component="th" scope="row">{user.login}</TableCell>
                <TableCell>{DateUtils.toStr(user.registrationDate)}</TableCell>
                <TableCell>{userSessions.length}</TableCell>
                <TableCell>{activeSessions.length ? <CheckIcon /> : null}</TableCell>
                <TableCell>{user.isAdmin ? <CheckIcon /> : null}</TableCell>
                <TableCell>{this.renderActionBtns(user, disabled)}</TableCell>
            </TableRow>
        );
    }

    render(){
        var users = _.sortBy(this.state.users, u => u._id);
        return this.state.loading ? <CircularProgress /> : (
            <Table id="Users">
                <TableHead>
                    <TableRow>
                        <TableCell>Login</TableCell>
                        <TableCell>Registration date</TableCell>
                        <TableCell>Sessions count</TableCell>
                        <TableCell>Has active sessions</TableCell>
                        <TableCell>Is admin</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map(u => this.renderTableRow(u))}
                </TableBody>
            </Table>
        );
    }
}