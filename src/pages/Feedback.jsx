import React from 'react'
import {connect} from 'dva'

class Feedback extends React.Component{
  componentDidMount() {
  }

  render() {

  }
}

export default connect(({user}) => ({
  feeback: user.feedback,
}))(Feedback)
