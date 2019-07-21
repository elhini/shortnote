import React from 'react';
import UsersApiClient from '../../api-clients/users';

interface UsersState {
    users: any[],
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
      this.usersAPIClient.getAll((users: any[]) => {
        this.setState({loadingList: false, users: users});
      });
    }

    render(){
        var users = this.state.users.map(user => <li key={user._id}>{user.login}</li>);
        return <ul>{users}</ul>;
    }
}