import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import Firebase, { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import './sub.css';

const INITIAL_STATE = {
  deadline: 0,
  title: '',
  userID: '',
  downloadURL: "",
  progress: 0,
  pdf: null,
  status: 'in progress',
  hasError: false,
  rev1: '',
  rev2: '',
  rev3: '',
};

class SubmissionRequestForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChange = e => {
    if (e.target.files[0]) {
      const pdf = e.target.files[0];
      this.setState(() => ({ pdf }));
    }
  };

  handleUpload = () => {
    try {
      const { pdf, deadline, title, email, status, rev1, rev2, rev3 } = this.state;
      const reviewers = {};
      const filename = pdf.name;
      const storageRef = this.props.firebase.storage.ref(`pdf/${filename}`);
      const uploadTask = storageRef.put(pdf);

      reviewers['rev1'] = rev1;
      reviewers['rev2'] = rev2;
      reviewers['rev3'] = rev3;

      uploadTask.on(
        'state_changed',
        snapshot => {
          // progress function ...
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          this.setState({ progress });
        },
        error => {
          // Error function ...
          console.log(error);
        },
        () => {
          // complete function ...
          this.props.firebase.storagePdf().child(filename).getDownloadURL().then(url => {
              this.setState({ url });
              var userID = this.props.firebase.auth.currentUser.uid;
              var downloadURL = url;
              this.props.firebase.submissions().push({
                userID,
                downloadURL,
                deadline,
                title,
                email,
                status,
                reviewers,
              });
            }).then(() => {
              this.setState({ ...INITIAL_STATE });
              this.props.history.push(ROUTES.SUBMISSION_TRACKER);
            });
        }
      );
    } catch(e) {
       console.log('Error');
    }
  };


  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase
        .user(authUser.uid)
        .on('value', snapshot => {
          this.setState({
            user: snapshot.val(),
            email: snapshot.val().email,
          });
        });
      } else {
        console.log("error");
      }
    })
  }

  componentWillUnmount() {
    this.props.firebase.user().off();
  }

  render() {

    const { user,
            title,
          } = this.state;

    return (
      <div>

        {user && (
        <div className="center">
            <br/>
            <h2 className="green-text">Journal Submissions</h2>
            <br/>
            <br/>
            <form handleUpload={this.handleUpload}>
              <div className="textbox">
              <input
                name="title"
                value={title}
                onChange={this.onChange}
                type="text"
                placeholder="Title"
              />
              </div>
            </form>
            <span> Author: {user.firstName} {user.lastName} </span>
            <div className="row">
              <progress value={this.state.progress} max="100" className="progress" />
            </div>
            <br/>
            <div className="file-field input-field">
              <div className="btn">
                <span>Choose a PDF</span>
                <input type="file" accept="application/pdf" onChange={this.handleChange} />
              </div>
              <div className="file-path-wrapper">
              </div>
            </div>
            <button
              onClick={this.handleUpload}
              className="waves-effect waves-light btn"
            >
              Submit Request
            </button>
        </div>
      )}
      </div>
    );
  }

}

export default withFirebase(SubmissionRequestForm);
