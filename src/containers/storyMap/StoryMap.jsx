import React, { Component } from 'react';
import data from './data.json';
import StoryCard from './StoryCard';
import styles from './StoryMap.scss'
import { PandaSvg, EditNameIcon } from '../../images/svg'
import { fromJS } from 'immutable'
import { withRouter } from 'react-router'
import { message, Button, Popover, Icon, Tooltip } from 'antd'
import { pushURL } from '../../actions/route'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import API from '../../utils/API.tsx'
import messageHandler from '../../utils/messageHandler'
import {
  setUserInfo,
  logout,
} from '../../actions/auth'
// import AddCardModal from './AddCardModal';
import EditCardContentModal from './EditCardContentModal'
const VIEW_TYPE_NAME = [
  { icon: '#F5DD0C', text: '待开始' },
  { icon: '#66B966', text: '进行中' },
  { icon: '#F45B6C', text: '已完成' },
]
class StoryMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
          userId: localStorage.getItem('userId'),
          token: localStorage.getItem('token'),
          showAddModal: false, //编辑内容
          // addCardModal: null, //1是列表，2是泳道
          showStateSelector: -1, //改变状态
        };
      }
      componentDidMount(){
          this.fetchMapList()
      }
      fetchMapList = () => {
        const { match, location, history } = this.props
        console.log(match)
        var getInformation ={
          method:"GET",
          headers:{
          "Content-Type":"application/json",
          userId: this.state.userId,
          token: this.state.token,
          },
          }
          fetch(`http://119.23.29.56:2228/card/list?mapId=${match.params.id}`,getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              this.setState({ cardList: json.data })
            }
            else {
              message.error(json.data);
            }
          })
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
           fetch("http://119.23.29.56:2228/card/create_list",getInformation)
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
          fetch("http://119.23.29.56:2228/card/create_lane",getInformation)
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

      handleChangeState = (v, vos) => {
        this.setState({
          showStateSelector: -1
        })
        var getInformation ={
          method:"POST",
          headers:{
          "Content-Type":"application/json",
          userId: this.state.userId,
          token: this.state.token,
          },
          body:JSON.stringify({ cardId: vos.id, state: v }),
          }
        fetch("http://119.23.29.56:2228/card/modify_state",getInformation)
        .then(response => response.json())
        .then(json =>{
          if(json.code === 0){
            message.success('编辑状态成功');
            this.fetchMapList()
          }
          else {
            message.error(json.data);
          }
        })
      }
      handleTypeVisibleChange = (visible, key) => {
        console.log(key, visible)
        this.setState({
          showStateSelector: visible ? key : -1
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
      render(){
          const { history } = this.props
          const { cardList, showAddModal, mapStoryCard, showStateSelector } = this.state

          console.log(cardList)
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
                <div className={styles.homeContentTop}>
                  {cardList && cardList.map((card, index) => {
                    return (
                      <div className={styles.homeCard} key={index}>
                        <div className={styles.homeCardTitle} style={{ color: card.title ? '#4a4a4a' : '#7CB2F1' }}>
                          {card.title ? card.title : '请输入标题'}<EditNameIcon onClick={() => this.setState({ showAddModal: true, mapStoryCard: card.vos[0] })}/>
                        </div>
                        {
                          card.vos.map((vos) => {
                            const contentType = () => (
                              VIEW_TYPE_NAME.map((v, k) => {
                                  return (
                                    <div className={styles.defaultValue} key={k} onClick={() => this.handleChangeState(k, vos)}>
                                      <span className={styles.dot} style={{ backgroundColor: VIEW_TYPE_NAME[k].icon }}/>
                                      <span className={styles.text}>{VIEW_TYPE_NAME[k].text}</span>
                                    </div>
                                )
                              })
                            )
                            console.log(showStateSelector === vos.id)
                            return(
                              <div className={styles.homeCardItem} key={vos.id}>
                                  <div className={styles.homeCardItemTitle}>
                                    <span style={{ color: vos.title ? '#4a4a4a' : '#7CB2F1' }}>
                                      {vos.title ? vos.title : '请输入卡片标题'}<EditNameIcon onClick={() => this.setState({ showAddModal: true, mapStoryCard: vos })} style={{ display: vos.state !== 0 && 'none' }}/>
                                    </span>
                                    <Popover
                                      overlayClassName={styles.selector}
                                      content={contentType()}
                                      visible={showStateSelector === vos.id}
                                      trigger="click"
                                      placement="bottom"
                                      onVisibleChange={(visible) => this.handleTypeVisibleChange(visible, vos.id)}
                                    >
                                      <span className={styles.defaultValue}>
                                        <span className={styles.dot} style={{ backgroundColor: VIEW_TYPE_NAME[vos.state].icon }}/>
                                        <span className={styles.text} style={{ color: VIEW_TYPE_NAME[vos.state].icon }}>{VIEW_TYPE_NAME[vos.state].text}</span>
                                        <Icon type="caret-down" />
                                      </span>
                                    </Popover>
                                  </div>
                                  <div className={styles.homeCardItemContent} style={{ color: vos.content ? '#4a4a4a' : '#7CB2F1' }}>
                                    {vos.content ? vos.content : '请输入卡片内容'}
                                  </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    )
                  })
                  }
                  {/* <Board data={data}
                    style={{ background: '#ffffff', display: 'inline-block', height: 'auto' }}
                    customCardLayout
                    addCardLink = "添加"
                      onDataChange={this.onDataChange}
                      onCardDelete={this.onCardDelete}
                      onCardAdd={this.onCardAdd}
                      onCardClick={this.onCardClick}
                      handleLaneDragEnd={this.handleLaneDragEnd}
                      handleDragEnd={this.handleDragEnd}
                      canAddLanes
                      editable
                      draggable> */}
                      {/* <StoryCard cardColor='#eee'
                      name='笑话'
                      dueOn='nizaigansha'
                      subTitle='xiao'
                      body='说点啥'
                      escalationText='这是啥'
                      /> */}
                  {/* </Board> */}
                  <Button className={styles.homeContentAddCol} onClick={() => this.addCardList()}>+ 添加列表</Button>
                </div>
                <Button className={styles.homeContentAddRow} onClick={() => this.addCardLane()}>+ 添加泳道</Button>
              </div>
              {/* {
                addCardModal &&
                <AddCardModal
                  type={addCardModal}
                  onCancel={() => this.setState({ addCardModal: null })}
                  fetchMapList={this.fetchMapList}
                  mapId={this.props.match.params.id}
                  />
              } */}
              {
                showAddModal &&
                <EditCardContentModal
                  mapStoryCard={mapStoryCard}
                  onCancel={() => this.setState({ showAddModal: false })}
                  fetchMapList={this.fetchMapList}
                  mapId={this.props.match.params.id}
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
