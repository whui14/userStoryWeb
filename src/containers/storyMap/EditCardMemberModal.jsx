import React, { Component } from 'react'
import { message, Modal, Select } from 'antd'
const Option = Select.Option

class EditCardMemberModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('token'),
        ownerId: props.mapStoryCard.ownerUser.userId || 0, //负责人的userId
      };
    }
  handleOk = () => {
    const { mapStoryCard } = this.props
    const { ownerId } = this.state
      var getInformation ={
        method:"POST",
        headers:{
        "Content-Type":"application/json",
        userId: this.state.userId,
        token: this.state.token,
        },
        body: JSON.stringify({
            cardId: mapStoryCard.id,
            ownerId,
            operatorId: this.state.userId,
        }),
        }
          fetch("http://172.19.240.118:8002/card/modify_owner",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('编辑卡片负责人成功');
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
  handleChange = (value) => {
      this.setState({ ownerId: value })
  }
  render(){
    const { memberList, mapStoryCard } = this.props
    return(
      <Modal
        visible
        title={'编辑卡片负责人'}
        okText='确定'
        cancelText='取消'
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
        width={400}
      >
      负责人：
        <Select defaultValue={mapStoryCard.ownerUser.username} style={{ width: 250 }} onChange={this.handleChange}>
        {
            memberList.length > 0 &&
            memberList.map((member) => {
                return (
                    <Option value={member.userId} key={member.userId}>{member.username}</Option>
                )
            })
        }
        </Select>
      </Modal>
    )
  }
}

export default EditCardMemberModal
