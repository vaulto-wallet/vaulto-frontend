import React from "react";
import { Form, Input, Icon, Button, InputNumber, Modal } from 'antd';
//import styles from './style.less';
import {connect} from "dva";

let id = 0;


@connect(({ userTransfers, userConfirmation }) => ({
  userTransfers, userConfirmation
}))export default class ConfirmationModal extends React.Component{  

    constructor(){
        super();
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCancel(){
        console.log("Confirmation modal cancel", this.props);
        const {dispatch} = this.props;
        dispatch(
            {
                type : "userConfirmation/toConfirm",
                payload : undefined
            });
    }

    handleSubmit(){
        console.log("Confirmation modal confirm", this.props);
        const {dispatch} = this.props;
        this.props.form.validateFields((err, values) => {
        if (!err) {
            const { code_2fa, master_password } = values;
            console.log('Received values of form: ', values);
            dispatch(
            {
                type : "userConfirmation/confirm",
                payload : {
                    code_2fa : code_2fa,
                    master_password : master_password
                }
            });
        }
        });
    }

    render() {
    console.log("ConfirmationModal");
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { passwordNotRequired } = this.props.userConfirmation;
    return (
        <div>
        <Modal zIndex={1010} title="Confirmation" visible={this.props.userConfirmation.toConfirm != undefined} onCancel={this.handleCancel} onOk={this.handleSubmit}>
        
        
        <Form>
            <Form.Item label="2FA Code">
            {getFieldDecorator('code_2fa', {
                rules: [{ required: true, message: 'Master password is required!' }],
            })(<Input/>)}
            </Form.Item>
            {!passwordNotRequired ?
            <Form.Item label="Master password">
            { getFieldDecorator('master_password', {
                rules: [{ required: true, message: 'Master password is required!' }],
            })(<Input type="password"/>)}
            </Form.Item> : null}
        </Form>
        </Modal>
  
        </div>
      );
    }
  }