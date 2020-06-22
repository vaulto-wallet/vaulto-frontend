import React, {Component} from 'react';
import { connect } from 'dva';
import {Button, Layout, Card, Modal, Input, Form} from 'antd'; 
const {
  Header, Content, Footer, Sider,
} = Layout;

@connect(({ userAccount }) => ({
  userAccount
}))
class CreateAccountForm extends Component{
  handleSubmit = values =>{
    console.log(this.props, values);
    dispatch({
          type: 'userAccount/createAccount',
          payload: values,
        });
  }
  

  render(){
    return (
      <Form layout="vertical" onFinish={this.handleSubmit}>
        <Form.Item label="User name" name="name">
           <Input/>
        </Form.Item>
        <Form.Item label="Master password" name="master_password"  rules={[{ required: true, message: 'Password is required!' }]}>
           <Input.Password type="password"/>
        </Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
                Create
        </Button>
      </Form>
    );
  
  }
};

//const CreatedAccountForm = Form.useForm({"name" : 'create_seed_form'})(CreateAccountForm);

@connect(({ userAccount }) => ({
  userAccount
}))
class DashboardPage extends Component{
  state = {
      createAccountCardVisible : false,
      createAccountModalVisible : false,
      masterPassword : null
  }


  componentDidMount(){
    console.log("Dashboard did mount");
    const { dispatch } = this.props;
    dispatch({
      type: 'userAccount/getAccount',
      payload: {},
    });

  }

  handleCreateAccount(){
    console.log("handleCreateSeed");
  }

  handleOpenCreateSeedDialog(){
    ;
  }

  handleFormFieldValue(e){
    console.log(e, this.value);
  }

  

  render(){
    const { userAccount } = this.props;
    const {account} = userAccount;
    console.log('DashboardPage render',this.props, account);

    return(
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <Modal
          title="Create account" 
          visible={this.state.createAccountModalVisible}
          onOk = {this.handleCreateAccount}
          onCancel = {()=>{this.setState({createAccountModalVisible:false})}}
        >
        <CreateAccountForm/>
        </Modal>
        { !account || !account.public_key || account.public_key.length == 0 ? <Card>
          <Button onClick={()=>{this.setState({createAccountModalVisible:true}) }}>Create account</Button>
        </Card> : null}
      </Content> 
  )}
}

export default DashboardPage;