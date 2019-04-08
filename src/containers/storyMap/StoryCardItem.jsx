import React, { Component } from 'react';
import { findDomNode } from 'react-dom';
import styles from './StoryMap.scss';
import { EditNameIcon, MoveIcon } from '../../images/svg';
import { message, Popover, Icon, Tooltip } from 'antd';

const VIEW_TYPE_NAME = [
    { icon: '#F5DD0C', text: '待开始' },
    { icon: '#66B966', text: '进行中' },
    { icon: '#F45B6C', text: '已完成' },
  ]




class StoryCardItem extends Component {
    render(){
        const { card,index } = this.props

        return (
            <div className={styles.homeCard} key={index}>
              <div className={styles.homeCardTitle} style={{ color: card.title ? '#4a4a4a' : '#7CB2F1' }}>
                {card.title ? card.title : '请输入标题'}<EditNameIcon onClick={() => this.props.handleAddModal(card.vos[0])}/>
              </div>
              {
                card.vos.map((vos) => {
                    const { isDragging, connectDragSource, connectDropTarget} = this.props;
                    let opacity = isDragging ? 0.1 : 1; //当被拖拽时呈现透明效果

                    return connectDragSource( //使用DragSource 和 DropTarget
                        connectDropTarget(
                        <div key={vos.id}>
                            <Cardlal
                                key={vos.id}
                                style={{ width: 300 ,opacity}}
                                vos={vos}
                                handleAddModal={this.props.handleAddModal}
                                handleEditModal={this.props.handleEditModal}
                                fetchMapList={this.props.fetchMapList}
                                handleRemoveModal={this.props.handleRemoveModal}
                            />
                            </div>
                            )
                    )
                })
              }
            </div>
          )
      }
}

// 使组件连接DragSource和DropTarget
// let flow = require('lodash.flow');
// export default flow(
//     DragSource(Types.CARD,CardSource,collect),
//     DropTarget(Types.CARD,CardTarget,collect1)
// )(StoryCardItem)
export default StoryCardItem

class Cardlal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userId: localStorage.getItem('userId'),
            token: localStorage.getItem('token'),
            showStateSelector: -1, //改变状态
        }
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
        fetch("http://172.19.240.118:8002/card/modify_state",getInformation)
        .then(response => response.json())
        .then(json =>{
          if(json.code === 0){
            message.success('编辑状态成功');
            this.props.fetchMapList()
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
    render(){
        const { vos } = this.props
        const contentType = (contentVos) => (
            VIEW_TYPE_NAME.map((v, k) => {
                return (
                  <div className={styles.defaultValue} key={k} onClick={() => this.handleChangeState(k, contentVos)}>
                    <span className={styles.dot} style={{ backgroundColor: VIEW_TYPE_NAME[k].icon }}/>
                    <span className={styles.text}>{VIEW_TYPE_NAME[k].text}</span>
                  </div>
              )
            })
          )
        return (
            <div className={styles.homeCardItem} key={vos.id}>
                <div className={styles.homeCardItemTitle}>
                    <span style={{ color: vos.title ? '#4a4a4a' : '#7CB2F1' }}>
                    {vos.title ? vos.title : '请输入卡片标题'}<EditNameIcon onClick={() => this.props.handleAddModal(vos)} style={{ display: vos.state !== 0 && 'none' }}/>
                    </span>
                    <Popover
                    overlayClassName={styles.selector}
                    content={contentType(vos)}
                    visible={this.state.showStateSelector === -1 ? false : this.state.showStateSelector === vos.id ? true : false}
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
                    <span>
                    {vos.content ? vos.content : '请输入卡片内容'}
                    </span>
                    <div>
                    <Tooltip title={`负责人：${vos.ownerUser.username}`} placement="top">
                        <Icon type="github" theme="filled" />
                    </Tooltip>
                    <EditNameIcon className={styles.homeCardItemContentSvg} onClick={() => this.props.handleEditModal(vos)}/>
                    <MoveIcon className={styles.homeCardItemContentMoveSvg} onClick={() => this.props.handleRemoveModal(vos)}/>
                    </div>
                </div>
            </div>
        )
    }
}
