import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';
import './submissionsList.css';

// 
// Submissions List: 
//    Editor page for viewing a list of submissions
// 

class SubmissionsList extends Component {

  // Constructor
  //    details: initializes empty lists of submissions (to be filled with firebase data, once loaded)
  //    params: (props), super props 
  //    return: n/a
  //
  constructor(props) {
    super(props);

    this.state = {
      submissionsInProgress: [],
      submissionsAccepted: [],
      submissionsRejected: []
    };
  };


  // componentDidMount()
  //    details: Upon loading page, get submissions data from firebase
  //              and put into an array (e.g. submissionsAccepted)
  //    params: none
  //    return: none
  //
  componentDidMount(){


    // Get the submissions in progress from firebase
    this.props.firebase.submissions().orderByChild('status').equalTo('in progress').on('value', snapshot => {
      if (snapshot.exists()) {
        const submissionsObject = snapshot.val();
        const submissionsList = Object.keys(submissionsObject).map(key => ({
          ...submissionsObject[key],
          submissionID: key,
        }));
        this.setState({
          submissionsInProgress: submissionsList,
        });
      };
    });

    // Get the accepted submissions from firebase
    this.props.firebase.submissions().orderByChild('status').equalTo('accepted').on('value', snapshot => {
      if (snapshot.exists()) {
        const submissionsObject = snapshot.val();
        const submissionsList = Object.keys(submissionsObject).map(key => ({
          ...submissionsObject[key],
          submissionID: key,
        }));
        this.setState({
          submissionsAccepted: submissionsList,
        });
      };
    });

    // Get the rejected submissions from firebase
    this.props.firebase.submissions().orderByChild('status').equalTo('rejected').on('value', snapshot => {
      if (snapshot.exists()) {
        const submissionsObject = snapshot.val();
        const submissionsList = Object.keys(submissionsObject).map(key => ({
          ...submissionsObject[key],
          submissionID: key,
        }));
        this.setState({
          submissionsRejected: submissionsList,
        });
      };
    });
  }


  // componentWillUnmount()
  //    details: Upon exiting page page, stop 'listening' to firebase
  //    params: none
  //    return: none
  //
  componentWillUnmount() {
    this.props.firebase.submissions().off();
  }


  // render()
  //    details: Render HTML components of page / display
  //    params: none
  //    return: render HTML page
  //
  render(){
    return(
      <div id="outer">
      <div id="info">

      {/* Make a table of submissions in progress */}
      <div>
      <h2 id="headerCenter">In Progress</h2>
          <table>
              <tr>
                <th>Submission</th>
                <th>Deadline</th>
                <th></th>
              </tr>
          {this.state.submissionsInProgress.map(submission => (
              <tr key={submission.submissionID}>
                <td>{submission.title}</td>
                <td>{(new Date(submission.deadline)).toString()}</td>
                <td>
                    <Link
                      to={{
                        pathname: `${ROUTES.EDITOR}/${submission.submissionID}`,
                        state: { submission },
                      }}
                    >
                      View/Edit
                    </Link>
                </td>
              </tr>
          ))}
        </table>
      </div>

      {/* Make a table of accepted submissions */}
      <div>
      <h2 id="headerCenter">Accepted</h2>
            <table>
                <tr>
                  <th>Submission</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
            {this.state.submissionsAccepted.map(submission => (
                <tr key={submission.submissionID}>
                  <td>{submission.title}</td>
                  <td>{(new Date(submission.deadline)).toString()}</td>
                  <td>
                      <Link
                        to={{
                          pathname: `${ROUTES.EDITOR}/${submission.submissionID}`,
                          state: { submission },
                        }}
                      >
                        View/Edit
                      </Link>
                  </td>
                </tr>
            ))}
          </table>
      </div>
      
      {/* Make a table of rejected submissions */}
      <div>
      <h2 id="headerCenter">Rejected</h2>
            <table>
                <tr>
                  <th>Submission</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
            {this.state.submissionsRejected.map(submission => (
                <tr key={submission.submissionID}>
                  <td>{submission.title}</td>
                  <td>{(new Date(submission.deadline)).toString()}</td>
                  <td>
                      <Link
                        to={{
                          pathname: `${ROUTES.EDITOR}/${submission.submissionID}`,
                          state: { submission },
                        }}
                      >
                        View/Edit
                      </Link>
                  </td>
                </tr>
            ))}
          </table>
      </div>

      </div>
      </div>
    )
  }
}


// export
//    details: exports the list of submissions
//    params: none
//    return: none
//
export default withFirebase(SubmissionsList);
