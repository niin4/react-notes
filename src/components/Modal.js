import React, { Component } from 'react';

class Modal extends Component {

  render() {
    if (!this.props.shown) {
      return null;
    }
    return (
      <div className="modal__bg">
        <div className="modal"><p>Do you want to remove the note?</p>
          <button className="button--fancy" onClick={this.props.confirmDelete}>Confirm</button>
          <button className="button--close" onClick={this.props.onClose}>X</button>
        </div>
      </div>
    )
  }
}

export default Modal;