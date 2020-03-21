import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './papersList.css';

import { withFirebase } from '../../Firebase';

class PaperItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewOnly: true,
      paper: null,
      ...props.location.state,
      newDeadline: new Date(props.location.state.paper.deadline),
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
    if (this.state.paper) {
      return;
    }

    this.props.firebase
      .paper(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          paper: snapshot.val(),
        });
      });
  }

  saveEdit() {
    // here you know which component is that, so you can call parent method
    // this.props.update(this.props.data.id);

    // var newPostKey = this.props.firebase.emptyRef().child('papers').push().key;

    // var deadlineDate = new Date(2020, 11, 1, 23, 59);

    const paperKey = this.props.match.params.id;
    console.log('papers/' + paperKey);

    // var postData = {
      // title: this.state.paper.title,
      // author: this.state.paper.author,
      // deadline: this.state.newDeadline.getTime()
    // };
  
    console.log(this.state.newDeadline.getTime());

    // var updates = {};
    // updates['/papers/' + newPostKey] = postData;
    // // updates['/user-posts/' + uid + '/' + newPostKey] = postData;

    this.props.firebase.specifiedRef('papers/' + paperKey).set({
      title: this.state.paper.title,
      author: this.state.paper.author,
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
      .paper(this.props.match.params.id)
      .once('value', snapshot => {
        this.setState({
          paper: snapshot.val(),
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
    this.props.firebase.paper(this.props.match.params.id).off();
  }


  render() {
    const { paper } = this.state;

    return (
      <div>
        <h2>{paper.title}</h2>
        {paper && (
          <div>
            <table>
              <tr>
                  <th>Submission Title: </th>
                  <td>{paper.title}</td>
              </tr>
              <tr>
                  <th>Author: </th>
                  <td>{paper.author}</td>
              </tr>
              <tr>
                  <th>Deadline: </th>
                  <td>{(new Date(paper.deadline)).toString()}</td>
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
              <strong>Title: </strong>  {paper.title}
            </span>
            <span>
              <strong>Author: </strong>  {paper.author}
            </span>
            <span>
              <strong>Deadline:</strong> {
                    (new Date(paper.deadline)).toString()
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

export default withFirebase(PaperItem);
