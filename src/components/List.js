import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { Link } from 'react-router-dom'
import {
  MDBRow, MDBCol, MDBCard, MDBCardBody, MDBBtn, MDBDataTable,
} from 'mdbreact'

import store from '../store'

const list = ({ projects }) => {
  const columns = [
    {
      label: 'Title',
      field: 'title',
      sort: 'asc',
    },
    {
      label: 'Action',
      field: 'action',
      sort: 'disabled',
    },
  ]

  const deleteItem = (id) => {
    if (window.confirm('Delete project?')) {
      axios.get('/api/delete', { params: { id } })
        .then(() => { store.dispatch({ type: 'getData' }) })
    }
  }

  const rows = projects ? projects.map((item) => ({
    title: <Link to={`/${item._id}`}>{item.title}</Link>,
    action: <MDBBtn onClick={() => deleteItem(item._id)} color="danger" outline size="sm">Delete</MDBBtn>,
  })) : []

  const table = { columns, rows }
  return (
    <MDBRow>
      <MDBCol md="12">
        <MDBCard>
          <MDBCardBody>
            <MDBDataTable
              striped
              hover
              noBottomColumns
              responsive
              theadColor="primary-color"
              theadTextWhite
              data={table}
            />
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  )
}

const mapStateToProps = (state) => ({ projects: state.projects })

export default connect(mapStateToProps)(list)
