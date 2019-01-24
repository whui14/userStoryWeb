import React, { Component } from 'react';
import data from './data.json';
import StoryCard from './StoryCard';
import Board from 'react-trello';
import styles from './StoryMap.scss'
import { PandaSvg } from '../../images/svg'
import { fromJS } from 'immutable'
import { withRouter } from 'react-router'
import { message, Button } from 'antd'
import { pushURL } from '../../actions/route'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import API from '../../utils/API.tsx'
import messageHandler from '../../utils/messageHandler'
import {
  setUserInfo,
  logout,
} from '../../actions/auth'
class StoryMap extends Component {
    constructor(props) {
        super(props);
        this.state = {};
      }
    onDataChange = (e) => {
        console.log('datachange',e)
    }
    onCardDelete= (e) => {
        console.log('delete',e)
    }
    onCardAdd= (e) => {
        console.log('add',e)
    }
    onCardClick= (e) => {
        console.log('click',e)
    }
    handleLaneDragEnd = (laneId, newPosition, payload) => {
        console.log('lanedrag',laneId, newPosition, payload)
    }
    handleDragEnd = (cardId, sourceLaneId, targetLaneId, position, cardDetails) => {
        console.log('drag',cardId, sourceLaneId, targetLaneId, position, cardDetails)
    }
    logoutUser = () => {
      const { history } = this.props
      var getInformation ={
        method:"POST",
        headers:{
        "Content-Type":"application/json",
        token: this.state.token,
        },
        }
        fetch("http://119.23.29.56:2228/user/logout",getInformation)
        .then(response => response.json())
        .then(json =>{
          if(json.code === 0){
            message.success('退出成功');
            history.push(`/`)
          }
          else {
            message.error(json.data);
          }
        })
    }
    render(){
        const { history } = this.props
        return (
          <div className={styles.storyContainer}>
            <div className={styles.homeTop}>
              <div>
                <Button className={styles.homeAddBtn} onClick={() => history.push(`/home`)}>
                  返回故事列表
                </Button>
              </div>
              <div>
                <PandaSvg className={styles.homeLogoutSvg}/>
                <Button className={styles.homeLogoutBtn} onClick={() => this.logoutUser()}>
                  退出登录
                </Button>
              </div>

            </div>
            <div className={styles.homeContent}>
              <Board data={data}
                style={{ background: '#ffffff' }}
                customCardLayout
                  onDataChange={this.onDataChange}
                  onCardDelete={this.onCardDelete}
                  onCardAdd={this.onCardAdd}
                  onCardClick={this.onCardClick}
                  handleLaneDragEnd={this.handleLaneDragEnd}
                  handleDragEnd={this.handleDragEnd}
                  canAddLanes
                  editable
                  draggable>
                  <StoryCard cardColor='#eee'
                  name='笑话'
                  dueOn='nizaigansha'
                  subTitle='xiao'
                  body='说点啥'
                  escalationText='这是啥'
                  />
              </Board>
            </div>
          </div>
        )
    }
}
function mapStateToProps(state) {
  return {
    user: fromJS(state).get('user')
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: bindActionCreators(setUserInfo, dispatch),
    logout: bindActionCreators(logout, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StoryMap))
