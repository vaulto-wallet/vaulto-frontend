import { Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { Link, connect } from 'umi';
import styles from './style.less';
import LoginFrom from './components/Login';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userAndlogin = {}, submitting } = props;
  const { status, type: loginType } = userAndlogin;
  const [autoLogin, setAutoLogin] = useState(false);
  const [type, setType] = useState('account');

  const handleSubmit = values => {
    const {dispatch} = props;
      console.log("Login submit", dispatch)
      dispatch({
        type: 'userLogin/login',
        payload: {
          ...values,
          type,
        },
      });
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="Account">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="Error loggin in" />
          )}

          <UserName
            name="userName"
            placeholder="username"
            rules={[
              {
                required: true,
                message: 'Username',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="password"
            rules={[
              {
                required: true,
                message: 'Password',
              },
            ]}
          />
        </Tab>
        {/*
        <Tab key="mobile" tab="手机号登录">
          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
          </Tab>*/}
        <div>
          {/*
          <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>*/}
        </div>
        <Submit loading={submitting}>Login</Submit>
      </LoginFrom>
    </div>
  );
};

export default connect(({ userLogin, loading }) => ({
    userLogin,
    submitting: loading.effects['userLogin/login'],
}))(Login);
