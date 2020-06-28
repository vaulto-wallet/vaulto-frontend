import React, {Component} from 'react';
import { connect } from 'dva';

import {Button, Input, InputNumber, Form, Select} from 'antd'; 

const Option = Select.Option;

const KEY_TYPE_UNKNOWN = 0
const KEY_TYPE_SEED = 1
const KEY_TYPE_ROOT = 2
const KEY_TYPE_SINGLE = 3
const KEY_TYPE_MULTI = 4


@connect(({ userAssets, userVaults }) => ({
  userAssets,userVaults
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
          type: 'userVaults/createVault',
          payload: values,
        });
        dispatch({
          type: 'userVaults/getVaults',
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
    const { assets } = this.props.userAssets || {};
    const { vaults } = this.props.userVaults || {};

    console.log("Render form", this.props, assets);
    
    const assets_options = assets ? Object.keys(assets).map( a => (
      <Option key={a}>{assets[a].symbol + " - " + assets[a].name}</Option>
    )) : [<Option key="undefined" value={0}>Undefined</Option>];

    let parent_keys_options = [];

    if(vaults){
      for(let a of Object.keys(vaults)){
          parent_keys_options.push(<Option key={a} value={a}>{vaults[a].name}</Option>)
      }
    }

      
    
    console.log("Options", assets_options );


    return (
      <Form ref={this.props.formRef} layout="vertical" onSubmit={this.handleSubmit}>
        <Form.Item label="Name" name='name'  rules={[{ required: true, message: 'Name field is required!' }]}>
           <Input/>
        </Form.Item>

        <Form.Item label="Asset" name='asset_id' rules={[{ required: this.isRequired(), message: 'Asset field is required!' }]}>
           <Select disabled={!this.isRequired()}>{ assets_options}</Select>
        </Form.Item>


        <Form.Item label="Parent key" name='seed_id' rules={[{ required: this.isRequired(), message: 'Parent type field is required!' }]}>
          <Select disabled={!this.isRequired()}>{parent_keys_options}</Select>
        </Form.Item>
        {/*}
        <Form.Item label="Master password" name='master_password' rules={[{ required: this.isRequired(), message: 'Master massword is required!' }]}>
          <Input disabled={!this.isRequired()} type="password"/>
        </Form.Item>*/}
      </Form>
    );
  
  }
};

export default CreatePrivateKeyForm;
