import React from 'react'
import moment from 'moment'
import axios from 'axios'

import Nestable from 'react-nestable'
import {
  MDBBtn, MDBIcon, MDBRow, MDBCol, MDBCardBody, MDBCard, MDBInput,
} from 'mdbreact'

import Modal from './Modal'
import Task from './Task'

import store from '../store'

import 'react-quill/dist/quill.snow.css'
import 'react-datepicker/dist/react-datepicker.css'

export default class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false,
      title: '',
      id: null,
      list: [],
      currentTask: {},
    }
  }

  componentDidMount() {
    const { match: { params: { id } } } = this.props
    this.fetch(id)
  }

  componentDidUpdate(prevProps) {
    const { match: { params: { id } } } = this.props
    if (prevProps.match.params.id !== id) {
      this.fetch(id)
    }
  }

  fetch(id) {
    const { history } = this.props
    axios.get('/api/detail', { params: { id } })
      .then((res) => {
        const list = this.convert(res.data.tasks)
        this.setState(() => ({
          title: res.data.title, id, list,
        }))
      })
      .catch(() => { history.push('/') })
  }

  convert(tasks, parent = 0) {
    return tasks.reduce((prev, now) => {
      const item = {
        ...now,
        id: now._id || now.id,
        parent,
        createdAt: now.createdAt || moment().valueOf(),
        description: now.description || '',
      }
      let data = [...prev, ...[item]]
      if (item.tasks) {
        data = [...data, ...this.convert(item.tasks, item.id)]
      }
      return data
    }, [])
  }

  updateList(tasks, parent = 0) {
    return tasks.filter((item) => item.parent === parent).map((item) => ({
      ...item,
      tasks: this.updateList(tasks, item.id),
    }))
  }

  changeTitle(e) {
    if (e.target.value) {
      this.setState({
        title: e.target.value,
      })
    }
  }

  reOrder(data) {
    const list = this.convert(data)
    this.setState({ list })
    this.saveProject()
  }

  saveProject(redirect = false) {
    const { title, list, id } = this.state
    const tasks = this.updateList(list)
    axios.post('/api/update', { title, tasks }, { params: { id } })
      .then(() => {
        if (redirect) {
          store.dispatch({ type: 'getData' })
        }
      })
  }

  toggle() {
    const { modal } = this.state
    this.setState({
      modal: !modal,
    })
  }

  showTask(id) {
    const { list } = this.state
    const task = list.find((item) => item.id === id)
    if (!task) return
    this.setState({
      currentTask: task,
    })
    this.toggle()
  }

  editTask(data) {
    const { currentTask } = this.state
    this.setState({
      currentTask: { ...currentTask, ...data },
    })
  }

  addTask(parent = 0) {
    const { list } = this.state
    const task = {
      id: Math.random().toString(36).substring(10),
      title: 'New Task',
      createdAt: moment().valueOf(),
      priority: 4,
      description: '',
      parent,
    }
    list.push(task)
    this.setState({ list })
    this.saveProject()
  }

  deleteTask(id) {
    const { list } = this.state
    const taskIndex = list.findIndex((item) => item.id === id)
    if (taskIndex === -1) return
    list.splice(taskIndex, 1)
    this.setState({ list })
    this.saveProject()
  }

  completeTask(id) {
    const { list } = this.state
    const taskIndex = list.findIndex((item) => item.id === id)
    if (taskIndex === -1) return
    const completed = list[taskIndex].completedAt
    list[taskIndex].completedAt = !completed ? moment().valueOf() : null
    this.setState({ list })
    this.saveProject()
  }

  saveTask(id) {
    const { list, currentTask } = this.state
    const taskIndex = list.findIndex((item) => item.id === id)
    if (taskIndex === -1) {
      this.toggle()
      return
    }
    list[taskIndex] = currentTask
    this.setState({ list })
    this.toggle()
    this.saveProject()
  }

  renderItem(params) {
    return (
      <Task
        params={params}
        completeTask={(e) => this.completeTask(e)}
        showTask={(e) => this.showTask(e)}
        addTask={(e) => this.addTask(e)}
        deleteTask={(e) => this.deleteTask(e)}
      />
    )
  }

  render() {
    const {
      title, list, modal, currentTask,
    } = this.state
    const items = this.updateList(list)
    const renderCollapseIcon = ({ isCollapsed }) => (isCollapsed ? <MDBIcon className="collapse-icon" icon="angle-down" /> : <MDBIcon className="collapse-icon" icon="angle-right" />)
    return (
      <MDBRow>
        <MDBCol md="12">
          <MDBCard>
            <MDBCardBody>
              <Modal
                modal={modal}
                task={currentTask}
                toggle={() => this.toggle()}
                saveTask={(e) => this.saveTask(e)}
                editTask={(e) => this.editTask(e)}
              />
              <MDBInput
                label="Title"
                icon="save"
                value={title}
                onChange={(e) => this.changeTitle(e)}
                onIconClick={() => this.saveProject(true)}
              />
              <Nestable
                items={items}
                renderItem={(e) => this.renderItem(e)}
                onChange={(e) => this.reOrder(e)}
                childrenProp="tasks"
                handler={<MDBIcon className="move-icon" icon="grip-vertical" />}
                renderCollapseIcon={(e) => renderCollapseIcon(e)}
              />
              <MDBBtn onClick={() => this.addTask()}>Add Task</MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    )
  }
}
