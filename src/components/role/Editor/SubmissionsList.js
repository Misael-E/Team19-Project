import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledCollapse, Button, CardBody, Card } from 'reactstrap';
import { withFirebase } from '../../Firebase';
import * as ROUTES from '../../../constants/routes';
import * as ROLES from '../../../constants/roles';
import './submissionsList.css';
// Add css for bootstrap / react-strap components
// import 'bootstrap/dist/css/bootstrap.min.css';

class SubmissionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submissionsInProgress: [],
      submissionsAccepted: [],
      submissionsRejected: []
    };
  };


  componentDidMount(){


    // Get the submissions in progress
    this.props.firebase.submissions().orderByChild('status').equalTo('in progress').limitToLast(3).on('value', snapshot => {
      if (snapshot.exists()) {
        const submissionsObject = snapshot.val();

        const submissionsList = Object.keys(submissionsObject).map(key => ({
          ...submissionsObject[key],
          submissionID: key,
        }));


      console.log(Object.keys(submissionsObject));
      console.log(submissionsList);

        this.setState({
          submissionsInProgress: submissionsList,
        });
      };
    });

    // Get the accepted submissions
    this.props.firebase.submissions().orderByChild('status').equalTo('accepted').limitToLast(3).on('value', snapshot => {
      if (snapshot.exists()) {
        const submissionsObject = snapshot.val();

        const submissionsList = Object.keys(submissionsObject).map(key => ({
          ...submissionsObject[key],
          submissionID: key,
        }));


      console.log(Object.keys(submissionsObject));
      console.log(submissionsList);

        this.setState({
          submissionsAccepted: submissionsList,
        });
      };
    });

    // Get the rejected submissions
    this.props.firebase.submissions().orderByChild('status').equalTo('rejected').limitToLast(3).on('value', snapshot => {
      if (snapshot.exists()) {
        const submissionsObject = snapshot.val();

        const submissionsList = Object.keys(submissionsObject).map(key => ({
          ...submissionsObject[key],
          submissionID: key,
        }));


      console.log(Object.keys(submissionsObject));
      console.log(submissionsList);

        this.setState({
          submissionsRejected: submissionsList,
        });
      };
    });

    // var newPostKey = this.props.firebase.emptyRef().child('submissions').push().key;

    // var deadlineDate = new Date(2020, 11, 1, 23, 59);

    // var postData = {
    //   author: 'author1',
    //   title: 'title111',
    //   deadline: deadlineDate.getTime()
    // };


    // var updates = {};
    // updates['/submissions/' + newPostKey] = postData;
    // // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    // return this.props.firebase.emptyRef().update(updates);

    // //   this.props.firebase.submissions().update({
    // //     submissionID: 'mysubmissionID',

    // //     author: 'myAuthor',
    // //     title : 'myTitle'
    // // });

    // }


  }

  componentWillUnmount() {
    this.props.firebase.submissions().off();
  }


  render(){
    // const submissions  = this.state;
    return(
      <div>
      <div>

      <h2>In Progress</h2>
      {/* <Button id="togglerInProgress" style={{ marginBottom: '1rem' }}>
      In Progress <img height="20" src="https://img.icons8.com/ios-filled/50/000000/chevron-down.png"/>
    </Button>
      <UncontrolledCollapse toggler="#togglerInProgress">
      <Card>
        <CardBody> */}
          <table>
              <tr>
                <th>Submission</th>
                {/* <th>Author</th> */}
                <th>Deadline</th>
                <th></th>
              </tr>
          {this.state.submissionsInProgress.map(submission => (
              <tr key={submission.submissionID}>
                <td>{submission.title}</td>
                {/* <td>{submission.author}</td> */}
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
            // <li key={submission.submissionID}>
            //   {/* <span>
            //     <strong>Submission:</strong> {submission.title}
            //   </span>
            //   <span>
            //     <strong>Authors:</strong> {submission.author}
            //   </span>
            //   <span>
            //     <strong>Deadline:</strong> {
            //       (new Date(submission.deadline)).toString()
            //     }
            //   </span>
            // </li> */}
          ))}
        </table>
        {/* </CardBody>
      </Card>
    </UncontrolledCollapse> */}

      </div>
      <div>
      <h2>Accepted</h2>
      {/* <Button id="togglerAccepted" style={{ marginBottom: '1rem' }}>
        Accepted <img height="20" src="https://img.icons8.com/ios-filled/50/000000/chevron-down.png"/>
      </Button>
      <UncontrolledCollapse toggler="#togglerAccepted" >
        <Card>
          <CardBody> */}
            <table>
                <tr>
                  <th>Submission</th>
                  {/* <th>Author</th> */}
                  <th>Deadline</th>
                  <th></th>
                </tr>
            {this.state.submissionsAccepted.map(submission => (
                <tr key={submission.submissionID}>
                  <td>{submission.title}</td>
                  {/* <td>{submission.author}</td> */}
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
          {/* </CardBody>
        </Card>
      </UncontrolledCollapse> */}
      </div>
      <div>
      <h2>Rejected</h2>
      {/* <Button id="togglerRejected" style={{ marginBottom: '1rem' }}>
        Rejected <img height="20" src="https://img.icons8.com/ios-filled/50/000000/chevron-down.png"/>
      </Button>
      <UncontrolledCollapse toggler="#togglerRejected" >
        <Card>
          <CardBody> */}
            <table>
                <tr>
                  <th>Submission</th>
                  {/* <th>Author</th> */}
                  <th>Deadline</th>
                  <th></th>
                </tr>
            {this.state.submissionsRejected.map(submission => (
                <tr key={submission.submissionID}>
                  <td>{submission.title}</td>
                  {/* <td>{submission.author}</td> */}
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
          {/* </CardBody>
        </Card>
      </UncontrolledCollapse> */}
      </div>
      </div>
    )
  }
}

export default withFirebase(SubmissionsList);
