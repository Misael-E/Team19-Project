import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import './users.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,faEnvelope, faIdBadge, faUserTag } from '@fortawesome/free-solid-svg-icons';

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
      <body>
        <div>
          <h2 className="user">Users</h2>
          {loading && <div className="loading">Loading ...</div>}
          <ul className="list">
            {users.map(user => (
              <li key={user.uid}>
                <span>
                  <i>
                  <FontAwesomeIcon icon={faIdBadge} />
                  </i>
                  <strong>ID:</strong> {user.uid}
                </span>
                <span>
                  <i>
                  <FontAwesomeIcon icon={faEnvelope} />
                  </i>
                  <strong>E-Mail:</strong> {user.email}
                </span>
                <span>
                  <i>
                  <FontAwesomeIcon icon={faUser} />
                  </i>
                  <strong>First Name:</strong> {user.firstName}
                </span>
                <span>
                  <i>
                  <FontAwesomeIcon icon={faUser} />
                  </i>
                  <strong>Last Name:</strong> {user.lastName}
                </span>
                <span>
                  <i>
                  <FontAwesomeIcon icon={faUserTag} />
                  </i>
                  <strong>Role:</strong>
                  {user.roles[ROLES.ADMIN]}
                  {user.roles[ROLES.EDITOR]}
                  {user.roles[ROLES.REVIEWER]}
                  {user.roles[ROLES.RESEARCHER]}
                  {user.roles[ROLES.NONE]}
                </span>
                <span className="det">
                  <Link
                    to={{
                      pathname: `${ROUTES.ADMIN}/${user.uid}`,
                      state: { user },
                    }}
                  >
                    Details
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </body>
    );
  }
}

export default withFirebase(UserList);
