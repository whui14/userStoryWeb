import React, { Component } from 'react';
import { findDomNode } from 'react-dom';
import styles from './StoryMap.scss';
import { EditNameIcon, MoveIcon } from '../../images/svg';
import { message, Button, Popover, Icon, Tooltip, Card } from 'antd';
import { //引入react-dnd
    DragSource,
    DropTarget,
} from 'react-dnd';

const Types = { // 设定类型，只有DragSource和DropTarget的类型相同时，才能完成拖拽和放置
    CARD: 'CARD'
}
const VIEW_TYPE_NAME = [
    { icon: '#F5DD0C', text: '待开始' },
    { icon: '#66B966', text: '进行中' },
    { icon: '#F45B6C', text: '已完成' },
  ]

  //DragSource相关设定
const CardSource = {  //设定DragSource的拖拽事件方法
    beginDrag(props,monitor,component){ //拖拽开始时触发的事件，必须，返回props相关对象
        return {
            index:props.index
        }
    },
    endDrag(props, monitor, component){
      //拖拽结束时的事件，可选
    },
    canDrag(props, monitor){
      //是否可以拖拽的事件。可选
    },
    isDragging(props, monitor){
      // 拖拽时触发的事件，可选
    }
};

function collect(connect,monitor) { //通过这个函数可以通过this.props获取这个函数所返回的所有属性
    return{
        connectDragSource:connect.dragSource(),
        isDragging:monitor.isDragging()
    }
}
//CardItem.js

const CardTarget = {
    hover(props,monitor,component){
        if(!component) return null; //异常处理判断
        const dragIndex = monitor.getItem().index;//拖拽目标的Index
        const hoverIndex = props.index; //放置目标Index
        if(dragIndex === hoverIndex) return null;// 如果拖拽目标和放置目标相同的话，停止执行
        
        //如果不做以下处理，则卡片移动到另一个卡片上就会进行交换，下方处理使得卡片能够在跨过中心线后进行交换.
        const hoverBoundingRect = (findDomNode(component)).getBoundingClientRect();//获取卡片的边框矩形
        const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;//获取X轴中点
        const clientOffset = monitor.getClientOffset();//获取拖拽目标偏移量
        const hoverClientX = (clientOffset).x - hoverBoundingRect.left;
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) { // 从前往后放置
            return null
        }
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) { // 从后往前放置
            return null
        }
        props.DND(dragIndex,hoverIndex); //调用App.js中方法完成交换
        monitor.getItem().index = hoverIndex; //重新赋值index，否则会出现无限交换情况
    }
}

// //DropTarget相关设定
// const CardTarget = {
//     drop(props, monitor, component){ //组件放下时触发的事件
//         //...
//     },
//     canDrop(props,monitor){ //组件可以被放置时触发的事件，可选
//         //...
//     },
//     hover(props,monitor,component){ //组件在target上方时触发的事件，可选
//         //...
//     },
    
// };

function collect1(connect,monitor) {//同DragSource的collect函数
    return{
        connectDropTarget:connect.dropTarget(),
        isOver:monitor.isOver(), //source是否在Target上方
        isOverCurrent: monitor.isOver({ shallow: true }), 
        canDrop: monitor.canDrop(),//能否被放置
        itemType: monitor.getItemType(),//获取拖拽组件type
    }
}

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
let flow = require('lodash.flow');
export default flow(
    DragSource(Types.CARD,CardSource,collect),
    DropTarget(Types.CARD,CardTarget,collect1)
)(StoryCardItem)


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
