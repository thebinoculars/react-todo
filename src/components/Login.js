import React from 'react'
import axios from 'axios'
import store from '../store'

export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      error: '',
    }
  }

  changeHandler(e) {
    this.setState({
      error: '',
      [e.target.name]: e.target.value,
    })
  }

  login() {
    const { username, password } = this.state
    axios.post('/api/login', { username, password })
      .then((res) => {
        axios.defaults.headers.common['x-access-token'] = res.data.token
        store.dispatch({ type: 'login', payload: res.data.token })
      }).catch((err) => {
        const errorData = err.response.data
        if (errorData) {
          this.setState({ error: errorData.message })
        }
      })
  }

  render() {
    const { username, password, error } = this.state
    return (
      <div className="signin-card">
        <h1 className="display1">Login</h1>
        <div className="form-group">
          <span>Username</span>
          <input type="text" value={username} name="username" onChange={(e) => this.changeHandler(e)} className="form-control" />
        </div>
        <div className="form-group">
          <span>Password</span>
          <input type="password" value={password} name="password" onChange={(e) => this.changeHandler(e)} className="form-control" />
        </div>
        <div className="form-group">
          <span className="error-message">{error}</span>
        </div>
        <div>
          <button onClick={() => this.login()} className="btn btn-block btn-info ripple-effect" type="button">Sign in</button>
        </div>
      </div>
    )
  }
}
