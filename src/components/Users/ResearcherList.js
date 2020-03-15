import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

class ResearcherList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().orderByChild('roles/RESEARCHER').equalTo('RESEARCHER').on('value', snapshot => {
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
        <h2>Researchers</h2>
        {loading && <div>Loading ...</div>}
        <ul>
          {users.map(user => (
            <li key={user.uid}>
              <span>
                <strong>ID:</strong> {user.uid}
              </span>
              <span>
                <strong>E-Mail:</strong> {user.email}
              </span>
              <span>
                <strong>First Name:</strong> {user.firstName}
              </span>
              <span>
                <strong>Last Name:</strong> {user.lastName}
              </span>
              <span>
                <strong>Role:</strong> {user.roles[ROLES.RESEARCHER]}
              </span>
              <Link
                to={{
                  pathname: `${ROUTES.EDITOR}/${user.uid}`,
                  state: { user },
                }}
              >
                View History
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withFirebase(ResearcherList);
