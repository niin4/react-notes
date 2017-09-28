import React, { Component } from 'react';
var ReactMarkdown = require('react-markdown');
import Moment from 'react-moment';

class Note extends React.Component {

  constructor(props){
    super(props);
    this.editNote = this.editNote.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.note.notes_id !== nextProps.note.notes_id;
  }

  editNote() {
    this.props.note.notes_name = "New name";
  }

  render(){
    console.log(this.props);
      return ( 
        <div className="note__container"> 
          { this.props.note ?       
            <div className="note__content">
              <h1>{this.props.note.notes_name}</h1>
              <h4 className="note__date"><Moment format="Do MMMM YYYY" date={this.props.note.notes_date}/></h4>
              {this.props.note.notes_text ?
              <ReactMarkdown source={this.props.note.notes_text}></ReactMarkdown>
              : <p>Loading...</p>}
              <button onClick={this.editNote}>Edit</button>
            </div> : <p>No notes found</p>
          }
        </div>
      )
  }
}

export default Note;