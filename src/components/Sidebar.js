import React from 'react';
import { connect } from 'react-redux';

import { NavLink } from 'react-router-dom';
import { MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdbreact';

import logo from '../assets/logo.png';

const sidebar = ({ projects }) => (
  <div className="sidebar-fixed position-fixed">
    <NavLink to="/" className="logo-wrapper waves-effect">
      <img alt="Logo" className="img-fluid" src={logo} />
    </NavLink>
    <MDBListGroup className="list-group-flush">
      <NavLink to="/" exact activeClassName="activeClass">
        <MDBListGroupItem>
          <MDBIcon icon="list" className="mr-3" />
            Projects
        </MDBListGroupItem>
      </NavLink>
      {
        projects && projects.map((item) => (
          <NavLink key={item._id} to={`/${item._id}`} activeClassName="activeClass">
            <MDBListGroupItem>
              <MDBIcon icon="edit" className="mr-3" />
              { item.title }
            </MDBListGroupItem>
          </NavLink>
        ))
      }
    </MDBListGroup>
  </div>
);

const mapStateToProps = (state) => ({ projects: state.projects });

export default connect(mapStateToProps)(sidebar);
