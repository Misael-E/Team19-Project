import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import './users.css';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      if (snapshot.exists()) {
        const usersObject = snapshot.val();

        const usersList = Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key,
        }));

        this.setState({
          users: usersList,
          loading: false,
        });
      };
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
      {loading && <div>Loading ...</div>}
        <table>
              <tr>
                <th>ID</th>
                <th>E-Mail</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Role</th>
                <th></th>
              </tr>
          {users.map(user => (
              <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.email}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.roles[ROLES.ADMIN]}
                    {user.roles[ROLES.EDITOR]}
                    {user.roles[ROLES.REVIEWER]}
                    {user.roles[ROLES.RESEARCHER]}
                    {user.roles[ROLES.NONE]}</td>
                    <td>
                      <Link
                        to={{
                          pathname: `${ROUTES.ADMIN}/${user.uid}`,
                          state: { user },
                        }}
                      >
                        Details
                      </Link>
                    </td>
                </tr>
            ))}
          </table>

        </div>
    )
  }
}

export default withFirebase(UserList);
