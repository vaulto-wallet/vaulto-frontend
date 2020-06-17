import React, {Component} from 'react';
import { connect } from 'dva';

import {Button, Input, InputNumber, Form, Select, Modal} from 'antd'; 

const Option = Select.Option;

const KEY_TYPE_UNKNOWN = 0
const KEY_TYPE_SEED = 1
const KEY_TYPE_ROOT = 2
const KEY_TYPE_SINGLE = 3
const KEY_TYPE_MULTI = 4

//const UserEditFormCreated = Form.create({ name: 'user_edit_form' })(UserEditForm);


class UserEditForm extends Component{
  state =  {
    private_key_type : KEY_TYPE_UNKNOWN
  };
  
  componentDidMount(){
      const {dispatch} = this.props;
      dispatch({
          type : "userUsers/usersList",
          payload : {}
      })
  }

  handleSubmit = e =>{
    e.preventDefault();
    const { dispatch, onOk } = this.props;
    this.props.form.validateFields( (err, values) => {
      if(!err){
        console.log('User edit Form Received values', values);
      }
      if( onOk){
          onOk(values);
      }
    });
  }

  handleCancel = e =>{
      e.preventDefault();
      const {onCancel} = this.props;
      if(onCancel){onCancel()}
  }



  render(){
    const { getFieldDecorator } = this.props.form;
    const { groups } = this.props;
    const fields = this.props.fields || {};


    console.log("Render form", this.props);
    
    const group_options = groups ? groups.map( a => (
      <Option key={a.id}>{a.name}</Option>
    )) : [<Option key="undefined" value={0}>Undefined</Option>];

    let groups_options = [];

    if(groups){
      for(let a of groups){
          groups_options.push(<Option key={a.id} value={a.id}>{a.name}</Option>)
      }
    }

    
    console.log("Options", groups_options);


    return (
        <Modal title="User" visible={this.props.visible} onCancel={this.handleCancel} onOk={this.handleSubmit}>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
            {fields.name ? <Form.Item label="Name">
            {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Name field is required!' }],
            })(<Input/>)}</Form.Item> : null}
            {fields.groups ? <Form.Item label="Groups">
            {getFieldDecorator('groups', {
                rules: [{ required: true, message: 'Group field is required!' }],
            })(<Select disabled={false}>{groups_options}</Select>)}
            </Form.Item> : null}

            {fields.old_password ? <Form.Item label="Old Password">
            {getFieldDecorator('old_password', {
                rules: [{ required: true, message: 'Password is required!' }],
            })(<Input type="password"/>)}
            </Form.Item> : null}

            {fields.password ? <Form.Item label="Password">
            {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Password is required!' }],
            })(<Input type="password"/>)}
            </Form.Item> : null}

            {fields.password ? <Form.Item label="Confirm Password">
            {getFieldDecorator('password2', {
                rules: [{ required: true, message: 'Please confirm password' }],
                })(<Input type="password"/>)}
            </Form.Item> : null}
        </Form>
    </Modal>
    );
  
  }
};

export default connect(({ userUsers }) => ({userUsers}))(UserEditForm);
