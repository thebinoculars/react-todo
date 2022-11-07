import React from 'react'

import {
  MDBDropdownToggle, MDBDropdown, MDBDropdownMenu, MDBDropdownItem, MDBIcon,
} from 'mdbreact'

const colors = ['red', 'orange', 'green', 'black']

export default (props) => {
  const { params: { handler, collapseIcon, item } } = props
  const completed = !!item.completedAt

  const color = colors[item.priority - 1]
  return (
    <div className="task">
      {handler}
      {collapseIcon}
      <span className="label-checkbox">
        <input type="checkbox" className="checkbox" checked={completed} onChange={() => props.completeTask(item.id)} />
      </span>
      <span className="task-title" style={{ color, textDecoration: completed ? 'line-through' : 'none' }}>
        {item.title}
      </span>
      <MDBDropdown size="sm" className="actions">
        <MDBDropdownToggle color="transparent">
          <MDBIcon icon="ellipsis-h" />
        </MDBDropdownToggle>
        <MDBDropdownMenu basic>
          <MDBDropdownItem onClick={() => props.showTask(item.id)}>Edit</MDBDropdownItem>
          <MDBDropdownItem onClick={() => props.addTask(item.id)}>Add Child</MDBDropdownItem>
          <MDBDropdownItem onClick={() => props.deleteTask(item.id)}>Delete</MDBDropdownItem>
        </MDBDropdownMenu>
      </MDBDropdown>
    </div>
  )
}
