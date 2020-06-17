import React, {Component} from 'react';
import { connect } from 'dva';

import {Button, Input, InputNumber, Form, Select} from 'antd'; 

const Option = Select.Option;

const KEY_TYPE_UNKNOWN = 0
const KEY_TYPE_SEED = 1
const KEY_TYPE_ROOT = 2
const KEY_TYPE_SINGLE = 3
const KEY_TYPE_MULTI = 4


@connect(({ userAssets, userKeys }) => ({
  userAssets,userKeys
}))
class CreatePrivateKeyForm extends Component{
  state =  {
    private_key_type : KEY_TYPE_UNKNOWN
  };
  
  
  handleSubmit = e =>{
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFields( (err, values) => {
      if(!err){
        console.log('Received values', values);
        
        dispatch({
          type: 'userKeys/createKey',
          payload: values,
        });
        dispatch({
          type: 'userKeys/getKeys',
          payload: {},
        });
      }
    });
  }



  componentWillMount(){
    const { dispatch } = this.props;
    console.log( this.props );
    /*dispatch({
      type: 'userAssets/getAssets',
      payload: {},
    });
    
    dispatch({
      type: 'userKeys/getKeys',
      payload: {},
    });*/
  }

  isRequired = () => {
    const {private_key_type} = this.state;
    if( private_key_type == KEY_TYPE_SEED){
        return false;
    }
    return true;
  }



  handleKeyTypeChange = value =>{
    const {validateFields} = this.props.form;
    this.setState(
      {
          private_key_type : value
      },
      ()=>{
        validateFields(['parent_key'], { force: true });
        validateFields(['asset'], { force: true });
        validateFields(['network_type'], { force: true });
      }
    )
  }




  render(){
    const { getFieldDecorator } = this.props.form;
    const { assets } = this.props.userAssets || {};
    const { network_types } = this.props.userKeys || {};
    const { key_types } = this.props.userKeys || {};
    const { keys } = this.props.userKeys || {};

    console.log("Render form", this.props, assets, network_types, key_types);
    
    const assets_options = assets ? Object.keys(assets).map( a => (
      <Option key={a}>{a}</Option>
    )) : [<Option key="undefined" value={0}>Undefined</Option>];

    let parent_keys_options = [];

    if(keys){
      for(let a of Object.keys(keys)){
        if( keys[a].private_key_type == 1){
          parent_keys_options.push(<Option key={a} value={a}>{keys[a].name}</Option>)
        }
      }
    }

    const network_types_options = network_types ? network_types.map( a => (
      <Option key={a[0]} value={a[0]}>{a[1]}</Option>
    )) : [<Option key="undefined" value={0}>Undefined</Option>];

    const key_types_options = key_types ? key_types.map( a => (
      <Option key={a[0]} value={a[0]}>{a[1]}</Option>
    )) : [<Option key="undefined" value={0}>Undefined</Option>];

      
    
    console.log("Options", assets_options, network_types_options, key_types_options);


    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item label="Name">
          {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Name field is required!' }],
           })(<Input/>)}
        </Form.Item>

        <Form.Item label="Private key type">
          {getFieldDecorator('private_key_type', {
              rules: [{ required: true, message: 'Private Key type field is required!' }],
           })(<Select onChange={this.handleKeyTypeChange}>{key_types_options}</Select>)}
        </Form.Item>

        <Form.Item label="Asset">
          {getFieldDecorator('asset', {
              rules: [{ required: this.isRequired(), message: 'Asset field is required!' }],
           })(<Select disabled={!this.isRequired()}>{ assets_options}</Select>)}
        </Form.Item>

        <Form.Item label="Network type">
          {getFieldDecorator('network_type', {
              rules: [{ required: this.isRequired(), message: 'Network type field is required!' }],
           })(<Select disabled={!this.isRequired()}>{network_types_options}</Select>)}
        </Form.Item>


        <Form.Item label="Parent key">
          {getFieldDecorator('parent_key', {
            rules: [{ required: this.isRequired(), message: 'Parent type field is required!' }],
          })(<Select disabled={!this.isRequired()}>{parent_keys_options}</Select>)}
        </Form.Item>

        <Form.Item label="Master password">
          {getFieldDecorator('master_password', {
            rules: [{ required: this.isRequired(), message: 'Master massword is required!' }],
          })(<Input disabled={!this.isRequired()} type="password"/>)}
        </Form.Item>


        <Button type="primary" htmlType="submit" className="login-form-button">
                Save
        </Button>
      </Form>
    );
  
  }
};

export default CreatePrivateKeyForm;
