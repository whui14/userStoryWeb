import React, { Component } from 'react';
import { withRouter } from "react-router";
import { message } from 'antd';
import { fromJS } from 'immutable'
import AuthForm from './AuthForm';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pushURL } from '../../actions/route'
import {
  setUserInfo,
} from '../../actions/auth'
class LoginFrom extends Component {
  static displayName = 'LoginFrom';

  static propTypes = {};

  static defaultProps = {};

  formChange = (value) => {
    console.log('formChange:', value);
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
      body:JSON.stringify({email:values.name,password:values.password})
      }
      fetch("http://119.23.29.56:2228/user/login",getInformation)
      .then(response => response.json())
      .then(json =>{
        if(json.code === 0){
          this.props.setUserInfo(json.data)
          message.success('登录成功')
          history.push(`/home`)
        }
        else {
          message.error('邮箱或密码错误，请重试');
        }
      })
  };

  render() {
    const config = [
      {
        label: '邮箱',
        component: 'Input',
        componentProps: {
          placeholder: '邮箱',
          size: 'large',
          maxLength: 50,
        },
        formBinderProps: {
          name: 'name',
          required: true,
          message: '必填',
        },
      },
      {
        label: '密码',
        component: 'Input',
        componentProps: {
          placeholder: '密码',
          htmlType: 'password',
        },
        formBinderProps: {
          name: 'password',
          required: true,
          message: '必填',
        },
      },
      {
        label: '记住账号',
        component: 'Checkbox',
        componentProps: {},
        formBinderProps: {
          name: 'checkbox',
        },
      },
      {
        label: '登录',
        component: 'Button',
        componentProps: {
          type: 'primary',
        },
        formBinderProps: {},
      },
    ];

    const initFields = {
      name: '',
      password: '',
      checkbox: false,
    };

    const links = [
      { to: '/register', text: '立即注册' },
      // { to: '/forgetpassword', text: '找回密码' },
    ];

    return (
      <AuthForm
        title="用户故事地图登录"
        config={config}
        initFields={initFields}
        formChange={this.formChange}
        handleSubmit={this.handleSubmit}
        links={links}
      />
    );
  }
}
function mapStateToProps(state) {
  return {
    route: fromJS(state).get('route')
  }
}
function mapDispatchToProps(dispatch) {
  return {
    setUserInfo: bindActionCreators(setUserInfo, dispatch),
    pushURL: bindActionCreators(pushURL, dispatch)
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(LoginFrom))
