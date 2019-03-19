import React, { Component } from 'react';
import styles from './StoryHome.scss';
import { fromJS } from 'immutable';
import { withRouter } from 'react-router';
import { message, Button, Popover } from 'antd';
import { PandaSvg, EditNameIcon, DeleteIcon } from '../../images/svg';
import { pushURL } from '../../actions/route';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import API from '../../utils/API.tsx';
import messageHandler from '../../utils/messageHandler';
import DeleteStoryModal from './DeleteStoryModal';
import AddStoryModal from './AddStoryModal';
import {
  setUserInfo,
  logout,
} from '../../actions/auth';
import ChangePasswordModal from '../login/ChangePasswordModal';
import { throws } from 'assert';
class StoryHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
          mapList: [],
          userId: localStorage.getItem('userId'),
          token: localStorage.getItem('token'),
          showAddModal: false, //添加故事地图
          showDeleteModal: false, //删除故事地图
          mapStory: null, //选中的故事
          showChangePsw: false, //修改密码
          hovered: false,
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
          fetch("http://172.19.240.118:8002/map/list",getInformation)
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
          fetch("http://172.19.240.118:8002/user/logout",getInformation)
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
      handleHoverChange = () => {
        this.setState({ hovered: !this.state.hovered })
      }
      render(){
        const { match, location, user, pushURL, logout } = this.props
        const { mapList, showAddModal, showDeleteModal, mapStory, showChangePsw } = this.state
        const content = (
          <React.Fragment>
            <span className={styles.homeLogoutBtn} onClick={() => this.setState({ hovered: false ,showChangePsw: true })}>
              修改密码
            </span>
            <span className={styles.homeLogoutBtn} onClick={() => {this.setState({ hovered: false });this.logoutUser()}}>
              退出登录
            </span>
          </React.Fragment>
        )
        return (
            <div className={styles.homeContainer}>
              <div className={styles.homeTop}>
                <div>
                  <Button className={styles.homeAddBtn} onClick={() => this.setState({ showAddModal: true })}>
                    添加故事地图
                  </Button>
                </div>
                <div>
                  {/* <PandaSvg className={styles.homeLogoutSvg}/> */}
                  <Popover placement="bottom" content={content} trigger="click" visible={this.state.hovered}
                    onVisibleChange={this.handleHoverChange}
                  >
                    <Button>用户操作</Button>
                  </Popover>
                </div>

              </div>
              {mapList.length > 0 ?
              <div className={styles.homeContentDetail}>
                {mapList.map((m, index) => {
                  return(
                    <div className={styles.homeContentItem} key={index}>
                      <div className={styles.homeContentItemFlex}>
                        <span className={styles.homeContentItemName}>{m.name}<EditNameIcon onClick={() => this.setState({ showAddModal: true, mapStory: m })} style={{ display: m.state !== 0 && 'none' }}/>
                        </span>
                        <span className={styles.homeContentItemState} style={{ color: m.state === 0 ? '#66B966' : '#F45B6C' }}>{m.state === 0 ? '进行中' : '已结束'}</span>
                      </div>
                      <DeleteIcon className={styles.homeContentItemDelete} onClick={() => this.setState({ showDeleteModal: true, mapStory: m })}/>
                      <div className={styles.homeContentItemEnter} onClick={() => this.handleEnterDetail(m.id)}/>
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
              <AddStoryModal onCancel={() => this.setState({ showAddModal: false, mapStory: null })} fetchStoryList={this.fetchStoryList} mapStory={mapStory}/>
            }
            {
              showDeleteModal &&
              <DeleteStoryModal onCancel={() => this.setState({ showDeleteModal: false, mapStory: null })} fetchStoryList={this.fetchStoryList} mapStory={mapStory}/>
            }
            {
              showChangePsw &&
              <ChangePasswordModal
                onCancel={() => this.setState({ showChangePsw: false })}
              />
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
