import React, {Component} from 'react';
import { connect } from 'dva';

import {Button, Input, InputNumber, Form, Select} from 'antd'; 

const Option = Select.Option;

const KEY_TYPE_UNKNOWN = 0
const KEY_TYPE_SEED = 1
const KEY_TYPE_ROOT = 2
const KEY_TYPE_SINGLE = 3
const KEY_TYPE_MULTI = 4


@connect(({ userKeys, userAccounts }) => ({
  userKeys, userAccounts
}))
class CreatePrivateKeyShareForm extends Component{
  state =  {
    private_key_type : KEY_TYPE_UNKNOWN
  };
  
  
  handleSubmit = e =>{
    e.preventDefault();
    const { dispatch } = this.props;
    const { keydata } = this.props;
    this.props.form.validateFields( (err, values) => {
      if(!err){
        console.log('Received values', values);
        
        dispatch({
          type: 'userKeys/shareKey',
          payload: {
            "id" : keydata.id,
            "master_password" : values.master_password,
            "shared_to" : values.shared_to
          }
        });
      }
    });
  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }


  componentWillMount(){
    const { dispatch } = this.props;

    console.log( this.props );
    dispatch({
      type : "userAccounts/getAccounts",
      payload : {}
    })
  }


  render(){
    const { getFieldDecorator } = this.props.form;
    const { keys } = this.props.userKeys || {};
    const { accounts } = this.props.userAccounts || {};
    const { keydata } = this.props;

    console.log("Render key share form", this.props);
    
    let shared_users_options = [];
    let shared_users = "";
    


    if(keys && keydata && accounts){
        if(keys[keydata.id]){
            shared_users = keys[keydata.id].shared_keys.map( a => (a) )
        }
        
        shared_users_options = accounts ? Object.values(accounts).map( a => (
            <Option key={a.user} value={a.user}>{a.name}</Option>
        )) : [];
    }
    console.log("Options", shared_users, shared_users_options);


    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item label="Share with">
          {getFieldDecorator('shared_to', {
              initialValue : shared_users
          })
          (
            <Select
                mode = "multiple"
                placeholder = "Select users"
                onChange={this.handleChange}
            >
                {shared_users_options}
            </Select>
          )}
        </Form.Item>

        <Form.Item label="Master password">
          {getFieldDecorator('master_password', {
            rules: [{ required: true, message: 'Master password is required!' }],
          })(<Input type="password"/>)}
        </Form.Item>


        <Button type="primary" htmlType="submit" className="login-form-button">
                Save
        </Button>
      </Form>
    );
  
  }
};

export default CreatePrivateKeyShareForm;
