import React, { Component } from 'react'
import { message, Button,Modal,Form,Input } from 'antd'
const FormItem = Form.Item
class AddCardModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
        userId: localStorage.getItem('userId'),
        token: localStorage.getItem('token'),
      };
    }
  handleOk = () => {
    const { mapId, type } = this.props
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
          axis: 0,
          mapId: mapId,
          numberOfCards: value.count
        }),
        }
        //添加列表
        if(type === 1){
          fetch("http://172.19.240.118:8002/card/create_list",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('添加列表成功');
              this.props.fetchMapList()
              this.props.onCancel()
            }
            else {
              message.error(json.data);
            }
          })
        }
        else {
          fetch("http://172.19.240.118:8002/card/create_lane",getInformation)
          .then(response => response.json())
          .then(json =>{
            if(json.code === 0){
              message.success('添加泳道成功');
              this.props.fetchMapList()
              this.props.onCancel()
            }
            else {
              message.error(json.data);
            }
          })
        }

    })
  }
  handleCancel = () => {
    this.props.onCancel()
  }
  render(){
    //type为1是列表，2是泳道
    const { type } = this.props
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
        title={type === 1 ? '添加列表' : '添加泳道'}
        okText='确定'
        cancelText='取消'
        onOk={() => this.handleOk()}
        onCancel={() => this.handleCancel()}
      >
        <Form>
          <FormItem {...formItemLayout} label={type === 1 ? '列表数量' : '泳道数量'}>
            {getFieldDecorator('count', {
              rules: [{
                required: true,
                message: '数量不能为空'
              },{
                max: 16,
                message: '数量不能超过16位'
              },{
                required: /^[1-9]\d*$/,
                message: '请输入正整数'
              }
            ]
            })(
              <Input placeholder="请输入数量" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddCardModal)
