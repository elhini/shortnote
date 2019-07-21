import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import UsersApiClient from '../../api-clients/users';
import DateUtils from '../../utils/DateUtils';
import { User } from '../../types/index';

interface UsersState {
    users: User[],
    loadingList: boolean
}

export default class Users extends React.Component<{}, UsersState> {
    usersAPIClient: UsersApiClient;

    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            loadingList: false
        }
        this.usersAPIClient = new UsersApiClient(this);
    }

    componentDidMount() {
      this.setState({loadingList: true});
      this.usersAPIClient.getAll((users: User[]) => {
        this.setState({loadingList: false, users: users});
      });
    }

    render(){
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Login</TableCell>
                        <TableCell>Registration date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.users.map(user => (
                        <TableRow key={user._id}>
                            <TableCell component="th" scope="row">{user.login}</TableCell>
                            <TableCell>{DateUtils.toStr(user.registrationDate)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}