import React, { Component } from 'react';
var ReactMarkdown = require('react-markdown');
import Moment from 'react-moment';

class Note extends React.Component {
  render(){
    console.log(this.props);
      return ( 
        <div className="note__container"> 
          { this.props.note ?       
            <div className="note__content">
              <h1>{this.props.note.notes_name}</h1>
              <h4 class="note__date"><Moment format="Do MMMM YYYY" date={this.props.note.notes_date}/></h4>
              <ReactMarkdown source={this.props.note.notes_text}></ReactMarkdown>
            </div> : <p>No notes found</p>
          }
        </div>
      )
  }
}

export default Note;