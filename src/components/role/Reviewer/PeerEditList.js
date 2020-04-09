import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';

import './peeredit.css';

class PeerEditList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      papers: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase.submissions().orderByChild('reviewers/rev1').equalTo(this.props.firebase.auth.currentUser.uid)
          .on('value', snapshot => {
          if (snapshot.exists()) {
            const papersObject = snapshot.val();

            const paperList = Object.keys(papersObject).map(key => ({
              ...papersObject[key],
              uid: key,
            }));

            this.setState({
              papers: paperList,
              loading: false,
            });
          };
        });
      } else {
        console.log("error");
      }
    })
  }

  componentWillUnmount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase.submissions().orderByChild('reviewers/rev1').equalTo(this.props.firebase.auth.currentUser.uid)
          .off();
      }})
  }

  render() {
    const { papers, loading, revEmail } = this.state;

    return (
      <div>
      <h1> Track Your Submissions </h1>
      {loading && <div>Loading ...</div>}
        <table>
              <tr>
                <th>Submission ID</th>
                <th>E-Mail</th>
                <th>Status</th>
                <th>Title</th>
                <th></th>
              </tr>
          {papers.map(paper => (
              <tr key={paper.uid}>
                <td>{paper.uid}</td>
                <td>{paper.email}</td>
                <td>{paper.status}</td>
                <td>{paper.title}</td>
                <td>
                  <Link
                    to={{
                      pathname: `${ROUTES.REVIEWER}/${paper.uid}`,
                      state: { paper },
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

export default withFirebase(PeerEditList);
