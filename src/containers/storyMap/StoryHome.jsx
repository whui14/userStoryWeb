import React, { Component } from 'react'
import styles from './StoryHome.scss'
import { fromJS } from 'immutable'
import { withRouter } from 'react-router'
import { message, Button } from 'antd'
import { PandaSvg } from '../../images/svg'
import { pushURL } from '../../actions/route'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import API from '../../utils/API.tsx'
import messageHandler from '../../utils/messageHandler'

import AddStoryModal from './AddStoryModal'
import {
  setUserInfo,
  logout,
} from '../../actions/auth'
class StoryHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
          mapList: [],
          userId: localStorage.getItem('userId'),
          token: localStorage.getItem('token'),
          showAddModal: false, //添加故事地图
        };
      }
      componentDidMount(){
          this.fetchStoryList()
      }
      fetchStoryList = () => {
        var getInformation ={
          method:"GET",
          headers:{
          "Content-Type":"application/json",
          userId: this.state.userId,
          token: this.state.token,
          },
          }
          fetch("http://119.23.29.56:2228/map/list",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              this.setState({ mapList: json.data })
            }
            else {
              message.error(json.data);
            }
          })
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
      handleEnterDetail = (id) => {
        const { history } = this.props
        history.push(`/home/card/${id}`)
      }
      render(){
        const { match, location, user, pushURL, logout } = this.props
        const { mapList, showAddModal } = this.state
          console.log(mapList)
          return (
            <div className={styles.homeContainer}>
              <div className={styles.homeTop}>
                <div>
                  <Button className={styles.homeAddBtn} onClick={() => this.setState({ showAddModal: true })}>
                    添加故事地图
                  </Button>
                </div>
                <div>
                  <PandaSvg className={styles.homeLogoutSvg}/>
                  <Button className={styles.homeLogoutBtn} onClick={() => this.logoutUser()}>
                    退出登录
                  </Button>
                </div>

              </div>
              {mapList.length > 0 ?
              <div className={styles.homeContentDetail}>
                {mapList.map((m, index) => {
                  return(
                    <div className={styles.homeContentItem} key={index} onClick={() => this.handleEnterDetail(m.id)}>
                      <div className={styles.homeContentItemFlex}>
                        <span className={styles.homeContentItemName}>{m.name}</span>
                        <span className={styles.homeContentItemState}>{m.state === 0 ? '进行中' : '已结束'}</span>
                      </div>
                    </div>
                  )
                })
                }
              </div>
              :
              <div className={styles.homeNoContent}>
                您的故事地图列表是空的呦，快快去创建吧！
              </div>
            }
            {
              showAddModal &&
              <AddStoryModal onCancel={() => this.setState({ showAddModal: false })} fetchStoryList={this.fetchStoryList}/>
            }
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StoryHome))
