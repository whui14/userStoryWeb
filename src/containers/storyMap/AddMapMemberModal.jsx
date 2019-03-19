import React, { Component } from 'react'
import { message, Button,Modal,Form,Input } from 'antd'
const FormItem = Form.Item
class AddMapMemberModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('token'),
      };
    }
  handleOk = () => {
    const { mapId } = this.props
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
        body: JSON.stringify({
            beOperatedEmail: value.email,
            mapId,
            operatorId: this.state.userId,
        }),
        }
          fetch("http://172.19.240.118:8002/member/add_member",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('添加成员成功');
              this.props.onRefersh()
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
        title={'添加地图成员'}
        okText='确定'
        cancelText='取消'
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <Form>
          <FormItem {...formItemLayout} label={'成员邮箱'}>
            {getFieldDecorator('email', {
              rules: [{
                required: true,
                message: '邮箱不能为空'
              },{
                required: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
                message: '请输入正确的邮箱号'
              }
            ]
            })(
              <Input placeholder="请输入成员邮箱" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddMapMemberModal)
