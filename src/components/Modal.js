import React from 'react'
import moment from 'moment'

import {
  MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput,
} from 'mdbreact'
import DatePicker from 'react-datepicker'
import ReactQuill from 'react-quill'

import 'react-quill/dist/quill.snow.css'
import 'react-datepicker/dist/react-datepicker.css'

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    ['clean'],
  ],
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image',
]

const colors = ['red', 'orange', 'green', 'black']

export default (props) => {
  const changeHandler = (event, name) => {
    const { task } = props
    let value = ''
    switch (name) {
      case 'dueDate':
        value = moment(event).valueOf()
        break
      case 'description':
        value = event
        break
      default:
        value = event.target.value || task[name]
        break
    }
    props.editTask({ [name]: value })
  }

  const { modal, task } = props

  return (
    <MDBModal isOpen={modal} toggle={() => props.toggle()}>
      <MDBModalHeader toggle={() => props.toggle()}>Edit Task</MDBModalHeader>
      <MDBModalBody>
        <MDBInput
          label="Title"
          value={task.title}
          onChange={(e) => changeHandler(e, 'title')}
          required
        />
        <span className="grey-text">Due Date</span>
        <DatePicker
          name="dueDate"
          selected={task.dueDate}
          onChange={(e) => changeHandler(e, 'dueDate')}
          showTimeSelect
          dateFormat="Pp"
          className="form-control"
        />
        <span className="grey-text">Priority</span>
        <select onChange={(e) => changeHandler(e, 'priority')} value={task.priority} className="custom-select">
          {[4, 3, 2, 1].map((item) => <option key={item} style={{ color: colors[item - 1] }} value={item}>{`Priority ${item}`}</option>)}
        </select>
        <span className="grey-text">Description</span>
        <ReactQuill
          value={task.description}
          onChange={(e) => changeHandler(e, 'description')}
          modules={modules}
          formats={formats}
        />
      </MDBModalBody>
      <MDBModalFooter>
        <MDBBtn onClick={() => props.saveTask(task.id)}>Save</MDBBtn>
      </MDBModalFooter>
    </MDBModal>
  )
}
