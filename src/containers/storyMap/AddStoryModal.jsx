import React, { Component } from 'react'
import { message, Button,Modal,Form,Input } from 'antd'
const FormItem = Form.Item
class AddStoryModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('token'),
      };
    }
  handleOk = () => {
    const { validateFields } = this.props.form
    validateFields((err, value) => {
      if (err) {
        return
      }
      var getInformation ={
        method:"POST",
        headers:{
        "Content-Type":"application/json",
        userId: this.state.userId,
        token: this.state.token,
        },
        body: JSON.stringify({ name: value.name })
        }
        fetch("http://119.23.29.56:2228/map/create",getInformation)
        .then(response => response.json())
        .then(json =>{
          if(json.code === 0){
            message.success('添加成功');
            this.props.fetchStoryList()
            this.props.onCancel()
          }
          else {
            message.error(json.data);
          }
        })
    })
  }
  handleCancel = () => {
    this.props.onCancel()
  }
  render(){
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 16
      }
    }
    return(
      <Modal
        visible
        title="添加故事地图"
        okText='确定'
        cancelText='取消'
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <Form>
          <FormItem {...formItemLayout} label="故事名称">
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '请输入故事名称'
              },{
                max: 16,
                message: '名称不能超过16位'
              }]
            })(
              <Input placeholder="请输入故事名称" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddStoryModal)
