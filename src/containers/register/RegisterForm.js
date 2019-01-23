/* eslint react/no-string-refs:0 */
import React, { Component } from 'react';
import { withRouter } from "react-router";
// import { Message } from '@alifd/next';
import { message } from 'antd';
import AuthForm from './AuthForm';

class RegisterForm extends Component {
  static displayName = 'RegisterForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      value: {},
    };
  }

  checkPassword = (rule, value, callback) => {
    if (!value) {
      callback('请输入正确的密码');
    } else if (value.length < 8) {
      callback('密码必须大于8位');
    } else if (value.length > 16) {
      callback('密码必须小于16位');
    } else {
      callback();
    }
  };

  checkPassword2 = (rule, value, callback, source) => {
    if (!value) {
      callback('请输入正确的密码');
    } else if (value && this.state.value.password !== source.rePassword) {
      callback('两次输入密码不一致');
    } else {
      callback();
    }
  };

  formChange = (value) => {
    console.log('formChange:', value);
    this.setState({
      value,
    });
  };

  handleSubmit = (errors, values) => {
    const { match, location, history } = this.props;
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log('values:', values);
    var getInformation ={
      method:"POST",
      headers:{
      "Content-Type":"application/json"
      },
      /* json格式转换 */
      body:JSON.stringify({email:values.email,password:values.password,registerCode:null,username:values.name})
      }
      fetch("http://119.23.29.56:2228/user/register",getInformation)
      .then(response => response.json())
      .then(json =>{
        if(json.code === 0){
          message.success('注册成功');
          history.push(`/home/${json.data.userId}/${json.data.token}`)
        }
        else {
          message.error('注册失败，请重试');
        }
      })
  };

  render() {
    const self = this;
    const config = [
      {
        label: '用户名',
        component: 'Input',
        componentProps: {
          placeholder: '用户名',
          size: 'large',
        },
        formBinderProps: {
          name: 'name',
          required: true,
          message: '请输入正确的用户名',
        },
      },
      {
        label: '邮箱',
        component: 'Input',
        componentProps: {
          placeholder: '邮箱',
          size: 'large',
        },
        formBinderProps: {
          type: 'email',
          name: 'email',
          required: true,
          message: '请输入正确的邮箱',
        },
      },
      {
        label: '密码',
        component: 'Input',
        componentProps: {
          placeholder: '至少8位密码',
          size: 'large',
          htmlType: 'password',
        },
        formBinderProps: {
          name: 'password',
          required: true,
          validator(rule, value, callback, source) {
            self.checkPassword(rule, value, callback, source);
          },
        },
      },
      {
        label: '确认密码',
        component: 'Input',
        componentProps: {
          placeholder: '确认密码',
          size: 'large',
          htmlType: 'password',
        },
        formBinderProps: {
          name: 'rePassword',
          required: true,
          validator(rule, value, callback, source) {
            self.checkPassword2(rule, value, callback, source);
          },
        },
      },
      {
        label: '注册',
        component: 'Button',
        componentProps: {
          type: 'primary',
        },
        formBinderProps: {},
      },
    ];

    const initFields = {
      name: '',
      email: '',
      password: '',
      rePassword: '',
    };

    const links = [
      { to: '/', text: '已有账号' },
      // { to: '/forgetpassword', text: '找回密码' },
    ];

    return (
      <div className="user-register">
        <AuthForm
          title="用户故事地图注册"
          config={config}
          initFields={initFields}
          links={links}
          formChange={this.formChange}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
export default withRouter(RegisterForm);
