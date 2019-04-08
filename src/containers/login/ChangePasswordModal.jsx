import React, { Component } from 'react'
import { message, Modal,Form,Input } from 'antd'
const FormItem = Form.Item
class ChangePasswordModal extends Component {
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
      //调用后端接口
      var getInformation ={
        method:"POST",
        headers:{
        "Content-Type":"application/json",
        userId: this.state.userId,
        token: this.state.token,
        },
        body: JSON.stringify({
          newPassword: value.newPsw,
          oldPassword: value.oldPsw
        }),
        }       
          fetch("http://172.19.240.118:8002/user/modify_password",getInformation)
          // fetch("http://119.23.29.56:2228/user/modify_password",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('修改密码成功');
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
  checkEqualPsw = (rule, value, callback) => {    
    const { getFieldValue } = this.props.form
    if (!value || value.length < 8) {
      callback('密码不能小于8位')
      return
    }
    if(value !== getFieldValue('newPsw')){
      callback('两次输入密码不一致')
      return
    }
    callback()
  }
  checkOldAndNewPsw = (rule, value, callback) => {    
    const { getFieldValue } = this.props.form
    if (!value || value.length < 8) {
      callback('密码不能小于8位')
      return
    }
    if(value === getFieldValue('oldPsw')){
      callback('新旧密码不能相同')
      return
    }
    callback()
  }

  render(){
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
        title={'修改密码'}
        okText='确定'
        cancelText='取消'
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <Form>
          <FormItem {...formItemLayout} label={'原密码'}>
            {getFieldDecorator('oldPsw', {
              rules: [{
                required: true,
                message: '原密码不能为空'
              },{
                min: 8,
                message: '密码不能小于8位'
              }
            ]
            })(
              <Input placeholder="请输入原密码"  type="password" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'新密码'}>
            {getFieldDecorator('newPsw', {
              rules: [{
                required: true,
                message: '新密码不能为空'
              },{
                validator: this.checkOldAndNewPsw
              }
            ]
            })(
              <Input placeholder="请输入新密码"  type="password" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={'确认新密码'}>
            {getFieldDecorator('rePsw', {
              rules: [
                {
                required: true,
                message: '确认新密码不能为空'
              },{
                validator: this.checkEqualPsw
              }
            ]
            })(
              <Input placeholder="请确认新密码"  type="password" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ChangePasswordModal)
