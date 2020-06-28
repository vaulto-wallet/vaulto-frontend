import React from "react";
import { Form, Input, Icon, Button, InputNumber, Modal } from 'antd';
import styles from './style.less';
import {connect} from "dva";


@connect(({ userTransfers, userConfirmation }) => ({
  userTransfers, userConfirmation
}))export default class TransferForm extends React.Component {
  constructor(){
    super();
    this.handleCancelConfirm = this.handleCancelConfirm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.id = 0;
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    //const keys = form.getFieldValue('keys');
    const keys =[]
    const nextKeys = keys.concat(this.id++);
    // can use data-binding to set
    // important! notify form to detect changes
    {/*form.setFieldsValue({
      keys: nextKeys,
    });*/}
  };

  handleSubmit = e => {
    e.preventDefault();
    const {dispatch, keyid} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, address, amount, description } = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map(key => ({address:address[key], amount:parseFloat(amount[key])} )  ));
        const outs = keys.map(key => ({address:address[key], amount:parseFloat(amount[key])} ));
        
        dispatch(
          {
            type : "userConfirmation/toConfirm",
            payload : {
              type : "userTransfers/createTransfer",
              passwordNotRequired : false,
              payload : {
                outs : outs,
                private_key : keyid,
                description : description
              }
            }
        });
      }
    });
  };

  handleCancel(){
    const {dispatch} = this.props;
    console.log("Handle cancel");
    dispatch({
      type : "userTransfers/transferForm",
      payload : undefined
    });
  }

  handleCancelConfirm(){
    const {dispatch} = this.props;
    dispatch({
      type : "userTransfers/cancelConfirmation",
      payload : {}
    });
  }

  componentDidMount(){
    this.add();
  }

  render() {
    //const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    //getFieldDecorator('keys', { initialValue: [] });
    //const keys = getFieldValue('keys');
    const keys = []
    const formItems = keys.map((k, index) => (
      <div>
      <Form.Item
        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
        label={index === 0 ? 'Address' : ''}
        required={false}
        key={k}
        name = {`address[${k}]`}
        validateTrigger = {['onChange', 'onBlur']}
        rules = {[
            {
              required: true,
              whitespace: true,
              message: "Please input address or delete this field.",
            },
          ]} >
        <Input placeholder="Address" style={{ width: '60%', marginRight: 8 }} />
      </Form.Item>
      <Form.Item
        name = {`amount[${k}]`} 
        validateTrigger = {['onChange', 'onBlur']}
        rules = {[
            {
              required: true,
              message: "Please input transfer value.",
            },
          ]} >
        <InputNumber placeholder="Amount" style={{ width: '20%', marginRight: 8 }} />
        {keys.length > 1 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
      </div>
    ));
    return (
      <div>
      <Modal title="Transfer" visible={this.props.visible} onCancel={this.handleCancel} onOk={this.handleSubmit}>
      <Form>
        {formItems}
        <Form.Item 
          name = {`description`} >
          <Input placeholder="Description" style={{ width: '80%', marginRight: 8 }} />          
        </Form.Item>

        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
            <Icon type="plus" /> Add address
          </Button>
        </Form.Item>
      </Form>
      </Modal>

      </div>
    );
  }
}