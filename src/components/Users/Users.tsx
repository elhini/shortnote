import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import BlockIcon from '@material-ui/icons/Block';
import UndoIcon from '@material-ui/icons/Undo';
import DeleteIcon from '@material-ui/icons/Delete';
import UsersApiClient from '../../api-clients/users';
import DateUtils from '../../utils/DateUtils';
import _ from 'lodash';
import { User } from '../../types/index';
import './Users.css';

interface UsersState {
    users: User[],
    loadingList: boolean,
    updatingUserID: string | null
}

type UserAction = 'block' | 'unblock' | 'delete';

export default class Users extends React.Component<{}, UsersState> {
    usersAPIClient: UsersApiClient;

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            loadingList: false,
            updatingUserID: null
        }
        this.usersAPIClient = new UsersApiClient(this);
    }

    componentDidMount() {
      this.setState({loadingList: true});
      this.usersAPIClient.getAll((users: User[]) => {
            this.setState({loadingList: false, users: users});
      });
    }

    onControlClick(user: User, action: UserAction){
        if (['block', 'unblock'].includes(action)){
            this.setState({updatingUserID: user._id});
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
            this.setState({updatingUserID: user._id});
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
        var unblockBtn = this.renderActionBtn(user, 'unblock', 'Unlock', disabled, <UndoIcon />);
        var deleteBtn = this.renderActionBtn(user, 'delete', 'Delete', disabled, <DeleteIcon />);
        return (<>
            {user.blocked ? unblockBtn : blockBtn}
            {deleteBtn}
        </>);
    }

    renderTableRow(user: User){
        var disabled = user._id === this.state.updatingUserID;
        return (
            <TableRow key={user._id}>
                <TableCell component="th" scope="row">{user.login}</TableCell>
                <TableCell>{DateUtils.toStr(user.registrationDate)}</TableCell>
                <TableCell>{this.renderActionBtns(user, disabled)}</TableCell>
            </TableRow>
        );
    }

    render(){
        var users = _.sortBy(this.state.users, u => u._id);
        return (
            <Table id="Users">
                <TableHead>
                    <TableRow>
                        <TableCell>Login</TableCell>
                        <TableCell>Registration date</TableCell>
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