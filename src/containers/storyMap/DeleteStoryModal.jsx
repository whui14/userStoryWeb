import React, { Component } from 'react'
import { message, Modal } from 'antd'

class DeleteStoryModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('token'),
      };
    }
  handleOk = () => {
      const { mapStory } = this.props
      var getInformation ={
        method:"POST",
        headers:{
        "Content-Type":"application/json",
        userId: this.state.userId,
        token: this.state.token,
        },
        }
          fetch(`http://172.19.240.118:8002/map/delete?mapId=${mapStory.id}`,getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('结束成功');
              this.props.fetchStoryList()
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
  render(){
    const { mapStory } = this.props
    return(
      <Modal
        visible
        title='结束故事地图'
        okText='确定'
        cancelText='取消'
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
        >
          确认要结束故事地图 {mapStory.name}？
        </Modal>
    )
  }
}

export default DeleteStoryModal
