import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import Firebase, { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import './sub.css';

const INITIAL_STATE = {
  author: '',
  deadline: '',
  title: '',
  pdf: "null",
  url: "",
  progress: 0,
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
    const { pdf } = this.state;
    const filename = pdf.name;
    const storageRef = this.props.firebase.storage.ref(`pdf/${filename}`);
    const uploadTask = storageRef.put(pdf);


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
        this.props.firebase.storage.ref("pdf/").child(filename).getDownloadURL().then(url => {
            this.setState({ url });
            var postKey = this.props.firebase.db.ref('Submissions').push().key;
            var user = this.props.firebase.auth.currentUser.uid;
            var updates = {};
            var postData = {
              downloadURL: url,
              user: this.props.firebase.auth.currentUser.uid
            };
            updates['/Submissions/' + postKey] = postData;
            this.props.firebase.db.ref().update(updates);
          });
      }
    );
  };
  handleDownload = () => {
    window.open(this.state.url);
  }

  render() {
    const {
      author = 'test',
      deadline = 'test',
      title = 'test',
      pdf = 'test',
      url = 'test',
      progress = 0
    } = this.state;



    return (
      <div>
        <h1 className="submission">Start Your Submission</h1>
        <div className="center">
            <br/>
            <h2 className="green-text">Journal Submissions</h2>
            <br/>
            <br/>

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
              Upload
            </button>
                <button
                  onClick={this.handleDownload}
                  className="waves-effect waves-light btn"
                >
                  Download
                </button>

        </div>
      </div>
    );
  }

}

export default withFirebase(SubmissionRequestForm);
