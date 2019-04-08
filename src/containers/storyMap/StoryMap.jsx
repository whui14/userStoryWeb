import React, { Component } from 'react';
import styles from './StoryMap.scss';
import { PandaSvg } from '../../images/svg';
import { fromJS } from 'immutable';
import { withRouter } from 'react-router';
import { message, Button, Popover, Icon, Tooltip } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  setUserInfo,
  logout,
} from '../../actions/auth';
// import AddCardModal from './AddCardModal';
import EditCardContentModal from './EditCardContentModal';
import ChangePasswordModal from '../login/ChangePasswordModal';
import AddMapMemberModal from './AddMapMemberModal';
import EditCardMemberModal from './EditCardMemberModal';
// import {DragDropContext} from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';
import StoryCard from './StoryCard';
import MoveCardModal from './MoveCardModal';

class StoryMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userId: localStorage.getItem('userId'),
          token: localStorage.getItem('token'),
          showAddModal: false, //编辑内容
          // addCardModal: null, //1是列表，2是泳道
          showChangePsw: false, //修改密码
          hovered: false,
          memberHovered: false,
          memberList: [], //地图成员列表
          showAddMemberModal: false, //添加地图成员
          showModifyCardModal: false, //修改卡片负责人
          showMoveModal: false, //移动位置
        };
      }
      componentDidMount(){
          this.fetchMapList()
          this.fetchMember()
      }
      fetchMapList = () => {
        const { match, location, history } = this.props
        var getInformation ={
          method:"GET",
          headers:{
          "Content-Type":"application/json",
          userId: this.state.userId,
          token: this.state.token,
          },
          }
          fetch(`http://172.19.240.118:8002/card/list?mapId=${match.params.id}`,getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              function compare(property){
                return function(a,b){
                    var value1 = a[property];
                    var value2 = b[property];
                    return value1 - value2;
                }
            }
              let cardList = json.data.map((card) => {
                 card.vos.sort(compare('yaxis'))
                 return card
              })
              console.log(cardList)
              this.setState({ cardList })
            }
            else {
              message.error(json.data);
            }
          })
      }
      fetchMember = () => {
        const { match, location, history } = this.props
        var getInformation ={
          method:"POST",
          headers:{
          "Content-Type":"application/json",
          userId: this.state.userId,
          token: this.state.token,
          },
          }
          fetch(`http://172.19.240.118:8002/member/members?mapId=${match.params.id}`,getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              this.setState({ memberList: json.data })
            }
            else {
              message.error(json.data);
            }
          })
      }

      //添加列表
      addCardList = () => {
         const { cardList } = this.state
         var getInformation ={
           method:"POST",
           headers:{
           "Content-Type":"application/json",
           userId: this.state.userId,
           token: this.state.token,
           },
           body: JSON.stringify({
             axis: cardList.length,
             mapId: this.props.match.params.id,
             numberOfCards: cardList.length === 0 ? 1 : cardList[0].vos.length
           }),
           }
           fetch("http://172.19.240.118:8002/card/create_list",getInformation)
           .then(response => response.json())
           .then(json =>{
             if(json.code === 0){
               message.success('添加列表成功');
               this.fetchMapList()
             }
             else {
               message.error(json.data);
             }
           })
      }
      //添加泳道
      addCardLane = () => {
        const { cardList } = this.state
        var getInformation ={
          method:"POST",
          headers:{
          "Content-Type":"application/json",
          userId: this.state.userId,
          token: this.state.token,
          },
          body: JSON.stringify({
            axis: cardList.length === 0 ? 0 : cardList[0].vos.length,
            mapId: this.props.match.params.id,
            numberOfCards: cardList.length === 0 ? 1 : cardList.length
          }),
          }
          fetch("http://172.19.240.118:8002/card/create_lane",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('添加泳道成功');
              this.fetchMapList()
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
      handleHoverChange = () => {
        this.setState({ hovered: !this.state.hovered })
      }
      handleMemberHoverChange = () => {
        this.setState({ memberHovered: !this.state.memberHovered })
      }
      handleDeleteMapMember = (email) => {
        var getInformation ={
          method:"POST",
          headers:{
          "Content-Type":"application/json",
          userId: this.state.userId,
          token: this.state.token,
          },
          body: JSON.stringify({
            beOperatedEmail: email,
            mapId: this.props.match.params.id,
            operatorId: this.state.userId,
          }),
          }
          fetch("http://172.19.240.118:8002/member/remove_member",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('删除成员成功');
              this.fetchMember()
            }
            else {
              message.error(json.data);
            }
          })
      }

      render(){
          const { history } = this.props
          const { showMoveModal, showModifyCardModal, showAddMemberModal, memberList, cardList, showAddModal, mapStoryCard, showStateSelector, showChangePsw, userId } = this.state
          const content = (
            <React.Fragment>
              <span className={styles.homeLogoutBtn} onClick={() => this.setState({ hovered: false, showAddMemberModal: true })}>
                添加成员
              </span>
              {/* <span className={styles.homeLogoutBtn} onClick={() => this.setState({ showDeleteMemberModal: true })}>
                移除成员
              </span> */}
              <span className={styles.homeLogoutBtn} onClick={() => this.setState({ hovered: false, showChangePsw: true })}>
                修改密码
              </span>
              <span className={styles.homeLogoutBtn} onClick={() => {this.setState({ hovered: false });this.logoutUser()}}>
                退出登录
              </span>
            </React.Fragment>
          )
          const memberContent = (
                memberList.length > 0 &&
                memberList.map((member) => { 
                  return (
                  <div key={member.userId} className={styles.homeMember} >
                    {member.username}
                    {member.userId !== userId && <Icon type="delete" theme="twoTone" onClick={() => {this.setState({ memberHovered: false });this.handleDeleteMapMember(member.email)}}/>}
                  </div>
                  )
                })
          )
          console.log(showMoveModal)
          
          return (
            <div className={styles.storyContainer}>
              <div className={styles.homeTop}>
                <div>
                  <Button className={styles.homeAddBtn} onClick={() => history.push(`/home`)}>
                    返回故事列表
                  </Button>
                </div>
                <div>
                  <Tooltip title="成员列表" placement="leftBottom">
                  <Popover placement="bottom" content={memberContent} trigger="click" visible={this.state.memberHovered}  onVisibleChange={this.handleMemberHoverChange}>
                    <PandaSvg className={styles.homeLogoutSvg}/>
                  </Popover>
                  </Tooltip>

                  <Popover placement="bottom" content={content} trigger="click" visible={this.state.hovered}
                    onVisibleChange={this.handleHoverChange}
                  >
                    <Button>用户操作</Button>
                  </Popover>
                </div>

              </div>
              <div className={styles.homeContent}>
                <div className={styles.homeContentTop}>
                  <StoryCard
                    cardList={cardList}
                    handleAddModal={(mapStoryCard) => this.setState({ showAddModal: true, mapStoryCard: mapStoryCard })}
                    handleEditModal={(mapStoryCard) => this.setState({ showModifyCardModal:true, mapStoryCard: mapStoryCard })}
                    fetchMapList={this.fetchMapList}
                    handleRemoveModal={(mapStoryCard) => this.setState({ showMoveModal:true, mapStoryCard: mapStoryCard })}
                  />
                  <Button className={styles.homeContentAddCol} onClick={() => this.addCardList()}>+ 添加列表</Button>
                </div>
                <Button className={styles.homeContentAddRow} onClick={() => this.addCardLane()}>+ 添加泳道</Button>
              </div>
              {
                showAddModal &&
                <EditCardContentModal
                  mapStoryCard={mapStoryCard}
                  onCancel={() => this.setState({ showAddModal: false })}
                  fetchMapList={this.fetchMapList}
                  mapId={this.props.match.params.id}
                  />
              }
              {
                showChangePsw &&
                <ChangePasswordModal
                  onCancel={() => this.setState({ showChangePsw: false })}
                  />
              }
              {
                showAddMemberModal &&
                <AddMapMemberModal
                  mapId={this.props.match.params.id}
                  onCancel={() => this.setState({ showAddMemberModal: false })}
                  onRefersh={this.fetchMember}
                  />
              }
              {
                showModifyCardModal &&
                <EditCardMemberModal
                  mapStoryCard={mapStoryCard}
                  memberList={memberList}
                  onCancel={() => this.setState({ showModifyCardModal: false })}
                  onRefersh={this.fetchMapList}
                  />
              }
              {
                showMoveModal &&
                <MoveCardModal
                  mapStoryCard={mapStoryCard}
                  cardList={cardList}
                  onCancel={() => this.setState({ showMoveModal: false })}
                  onRefersh={this.fetchMapList}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(StoryMap))
