import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { Route, Switch } from 'react-router-dom'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import List from './components/List'
import Detail from './components/Detail'
import Login from './components/Login'

import 'bootstrap-css-only/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'mdbreact/dist/css/mdb.css'
import './assets/style.css'

if (localStorage.getItem('accessToken')) {
  axios.defaults.headers.common['x-access-token'] = localStorage.getItem('accessToken')
}

const app = () => {
  if (!localStorage.getItem('accessToken')) {
    return <Login />
  }

  return (
    <div className="flexible-content">
      <Navbar />
      <Sidebar />
      <div id="content" className="p-5">
        <Switch>
          <Route path="/" exact component={List} />
          <Route path="/:id" component={Detail} />
        </Switch>
      </div>
      <Footer />
    </div>
  )
}

const mapStateToProps = (state) => ({ requireLogin: state.requireLogin })

export default connect(mapStateToProps)(app)
