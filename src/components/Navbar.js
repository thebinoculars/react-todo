import React from 'react'
import axios from 'axios'

import {
  MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavbarToggler, MDBCollapse, MDBNavItem, MDBNavLink,
} from 'mdbreact'

import store from '../store'

export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapse: false,
    }
  }

  componentDidMount() {
    store.dispatch({ type: 'getData' })
  }

  toggleNavbar() {
    const { collapse } = this.state
    this.setState({
      collapse: !collapse,
    })
  }

  addProject() {
    const data = {
      title: 'New Project',
      tasks: [],
    }
    axios.post('/api/create', data)
      .then(() => {
        store.dispatch({ type: 'getData' })
        this.setState({ collapse: false })
      })
  }

  render() {
    const { collapse } = this.state

    return (
      <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
        <MDBNavbarBrand href="/">
          <strong>Home</strong>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={() => this.toggleNavbar()} />
        <MDBCollapse isOpen={collapse} navbar>
          <MDBNavbarNav left>
            <MDBNavItem>
              <MDBNavLink to="#" onClick={() => this.addProject()}>New Project</MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
          <MDBNavbarNav right>
            <MDBNavItem>
              <MDBNavLink to="#" onClick={() => store.dispatch({ type: 'logout' })}>Logout</MDBNavLink>
            </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    )
  }
}
