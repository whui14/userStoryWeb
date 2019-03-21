import React, { Component } from 'react';
import { message, Modal, Select } from 'antd';
const Option = Select.Option

class MoveCardModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('token'),
        move_x: props.mapStoryCard.xaxis || 0,
        move_y: props.mapStoryCard.yaxis || 0,
      };
    }
  handleOk = () => {
    const { mapStoryCard } = this.props
    const { move_x, move_y } = this.state
    console.log(move_x, move_y);
    
      var getInformation ={
        method:"POST",
        headers:{
        "Content-Type":"application/json",
        userId: this.state.userId,
        token: this.state.token,
        },
        body: JSON.stringify({
            cardId: mapStoryCard.id,
            operatorId: this.state.userId,
            targetXAxis: move_x,
            targetYAxis: move_y,
        }),
        }
          fetch("http://172.19.240.118:8002/card/modify_position",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('移动卡片成功');
              this.props.onRefersh()
              this.props.onCancel()
            }
            else {
              message.error(json.data);
            }
          })
  }
  handleCancel = () => {
    this.props.onCancel()
  }
  handleChangeX = (value) => {
      this.setState({ move_x: value })
  }
  handleChangeY = (value) => {
    this.setState({ move_y: value })
  }
  render(){
    const { cardList, mapStoryCard } = this.props
    const axis_x = cardList.map((card) => {return {title: card.title, xaxis: card.xaxis}})
    let axis_y = []
    for(let i = 0; i < cardList[0].vos.length; i++){
        axis_y.push(i)
    }
    
    console.log(axis_x, axis_y,mapStoryCard)
    
    return(
      <Modal
        visible
        title={mapStoryCard.title ? `移动[${mapStoryCard.title}]的位置` : '移动卡片位置'}
        okText='确定'
        cancelText='取消'
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
        width={400}
      >
        <div>
        列表：
            <Select defaultValue={mapStoryCard.xaxis} style={{ width: 250 }} onChange={this.handleChangeX}>
            {
                axis_x.length > 0 &&
                axis_x.map((x) => {
                    return (
                        <Option value={x.xaxis} key={x.xaxis}>{x.title} (第{x.xaxis+1}列)</Option>
                    )
                })
            }
            </Select>
        </div>
        <div style={{ marginTop: 20 }}>
        泳道：
        <Select defaultValue={mapStoryCard.yaxis} style={{ width: 250 }} onChange={this.handleChangeY}>
        {
            axis_y.length > 0 &&
            axis_y.map((y) => {
                return (
                    <Option value={y} key={y}>第{y+1}行</Option>
                )
            })
        }
        </Select>
        </div>
      </Modal>
    )
  }
}

export default MoveCardModal
