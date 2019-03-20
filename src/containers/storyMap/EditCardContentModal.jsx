import React, { Component } from 'react'
import { message, Button,Modal,Form,Input } from 'antd'
import { log } from 'util';
const FormItem = Form.Item

class EditCardContentModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('token'),
      };
    }
  handleOk = () => {
    const { mapStoryCard } = this.props
    const { validateFields } = this.props.form
    validateFields((err, value) => {
      if (err) {
        return
      }
        if(mapStoryCard.title != value.name){
          var getInformation ={
            method:"POST",
            headers:{
            "Content-Type":"application/json",
            userId: this.state.userId,
            token: this.state.token,
            },
            body:JSON.stringify({ cardId: mapStoryCard.id, title: value.name }),
            }
          fetch("http://172.19.240.118:8002/card/modify_title",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('编辑标题成功');
              this.props.fetchMapList()
              this.props.onCancel()
            }
            else {
              message.error(json.data);
            }
          })
        }

        if(mapStoryCard.content != value.content){
          var getInformation ={
            method:"POST",
            headers:{
            "Content-Type":"application/json",
            userId: this.state.userId,
            token: this.state.token,
            },
            body:JSON.stringify({ cardId: mapStoryCard.id, content: value.content }),
            }
          fetch("http://172.19.240.118:8002/card/modify_content",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('编辑内容成功');
              this.props.fetchMapList()
              this.props.onCancel()
            }
            else {
              message.error(json.data);
            }
          })
        }
        this.props.onCancel()
    })
  }
  handleCancel = () => {
    this.props.onCancel()
  }
  render(){
    const { mapStoryCard } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 15
      }
    }
    return(
      <Modal
        visible
        title='编辑卡片详情'
        okText='确定'
        cancelText='取消'
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <Form>
          <FormItem {...formItemLayout} label="卡片标题">
            {getFieldDecorator('name', {
              initialValue: mapStoryCard.title ? mapStoryCard.title : '',
              rules: [
              //   {
              //   required: true,
              //   message: '请输入卡片标题'
              // },
              {
                max:9,
                message: '标题不能超过9位'
              }]
            })(
              <Input placeholder="请输入卡片标题" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="卡片内容">
            {getFieldDecorator('content', {
              initialValue: mapStoryCard.content ? mapStoryCard.content : '',
              rules: [
              //   {
              //   required: true,
              //   message: '请输入卡片内容'
              // },
              {
                max: 40,
                message: '内容不能超过40位'
              }]
            })(
              <Input placeholder="请输入卡片内容" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(EditCardContentModal)
