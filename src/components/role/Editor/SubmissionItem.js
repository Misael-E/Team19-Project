import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './submissionsList.css';

import { withFirebase } from '../../Firebase';

class SubmissionItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewOnly: true,
      submission: null,
      ...props.location.state,
      newDeadline: new Date(props.location.state.submission.deadline),
      savedChangesMsg: ''
    };

    console.log(this.state.newDeadline);
  }

  handleChange = date => {
    this.setState({
      newDeadline: date
    });
  };

  componentDidMount() {
    if (this.state.submission) {
      return;
    }

    this.props.firebase
      .submission(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          submission: snapshot.val(),
        });
      });
  }

  saveEdit() {
    // here you know which component is that, so you can call parent method
    // this.props.update(this.props.data.id);

    // var newPostKey = this.props.firebase.emptyRef().child('submissions').push().key;

    // var deadlineDate = new Date(2020, 11, 1, 23, 59);

    const submissionKey = this.props.match.params.id;
    console.log('submissions/' + submissionKey);

    // var postData = {
      // title: this.state.submission.title,
      // author: this.state.submission.author,
      // deadline: this.state.newDeadline.getTime()
    // };

    console.log(this.state.newDeadline.getTime());

    // var updates = {};
    // updates['/submissions/' + newPostKey] = postData;
    // // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    this.props.firebase.specifiedRef('submissions/' + submissionKey).set({
      title: this.state.submission.title,
      // author: this.state.submission.author,
      deadline: this.state.newDeadline.getTime()
    },
    function(error) {
      if (error) {
        // The write failed...
        console.log('write failed');
      } else {
        // Data saved successfully!
        console.log('write success');
      }
    }
    ).then(() => {

      this.props.firebase
      .submission(this.props.match.params.id)
      .once('value', snapshot => {
        this.setState({
          submission: snapshot.val(),
          savedChangesMsg: 'Changes saved!'
        });
      });



    });


  }


  // db.push().set(values).then(() => {
  //   console.log('Successfully set');

  //   db.once('value').then((snap) => {
  //     console.log(snap);
  //   });
  // });

  // updateBookList: (id, data) => {
  //   let ref = firebaseDb.ref('NewBooks');
  //   return ref
  //     .child(id)
  //     .update(data)
  //     .then(() => ref.once('value'))
  //     .then(snapshot => snapshot.val())
  //     .catch(error => ({
  //       errorCode: error.code,
  //       errorMessage: error.message
  //     }));
  // }

  componentWillUnmount() {
    this.props.firebase.submission(this.props.match.params.id).off();
  }


  render() {
    const { submission } = this.state;

    return (
      <div>
        <h2>{submission.title}</h2>
        {submission && (
          <div>
            <table>
              <tr>
                  <th>Submission Title: </th>
                  <td>{submission.title}</td>
              </tr>
              <tr>
                  {/* <th>Author: </th> */}
                  {/* <td>{submission.author}</td> */}
              </tr>
              <tr>
                  <th>Deadline: </th>
                  <td>{(new Date(submission.deadline)).toString()}</td>
              </tr>
              <tr>
                  <th>Enter a new deadline: </th>
                  <td>{
                    <DatePicker
                    selected={this.state.newDeadline}
                    onChange={this.handleChange}
                  />
                  }</td>
              </tr>
            </table>

            <button onClick={this.saveEdit.bind(this)}>Save</button>
            {this.state.savedChangesMsg}

            {/* <span>
              <strong>Title: </strong>  {submission.title}
            </span>
            <span>
              <strong>Author: </strong>  {submission.author}
            </span>
            <span>
              <strong>Deadline:</strong> {
                    (new Date(submission.deadline)).toString()
                  }
            </span>
            <span>
              <DatePicker
                selected={this.state.newDeadline}
                onChange={this.handleChange}
              />
            </span> */}
          </div>
        )}
      </div>
    );
  }
}

export default withFirebase(SubmissionItem);
© 2020 GitHub, Inc.
