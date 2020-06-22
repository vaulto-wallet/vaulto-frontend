import React, {Component} from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import {Row, Col, Form, Input, InputNumber, Button} from 'antd';



@connect(({ userAccount, userAccounts }) => ({
  userAccount, userAccounts
}))
class SettingsPage extends Component{
  state = {
    code : null      
  }

  constructor(){
    super();
    this.confirmCode = this.confirmCode.bind(this);
    this.inputCodeChange = this.inputCodeChange.bind(this);
  }


  componentDidMount(){
    const { dispatch } = this.props;
    const { keys } = this.props.userAccount;
    console.log(  "Wallet component ", this.props );
    dispatch({
      type: 'userAccounts/getAccounts',
      payload: {}
    });
    dispatch({
      type: 'userAccount/getAccount',
      payload: {}
    });
    /*
    dispatch({
        type: 'userAccount/getOTP',
        payload: {}
    });*/
}



  inputCodeChange(value){
    console.log(value);
    this.setState({code:value});
  }
  
  confirmCode(e){
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch({
          type: 'userAccount/confirmOTP',
          payload: {code : this.state.code},
    });
  };

  render(){
    const {account} = this.props.userAccount;
    const {accounts} = this.props.userAccounts;
    console.log("Render Settings", this.props)
    return(
      <div style={{ textAlign: 'left' }}>
        {account && account.otp_key ?
          <div>
            <Row>
              <Col xs={24} xl={8} md={8} >
                <h4>Account : {accounts[account.id].name || ""}</h4>
                <h4>TOTP key : {account.otp_key}</h4>
                <InputNumber onChange={this.inputCodeChange}/>
                <Button type="primary" onClick={this.confirmCode} >
                      Confirm
                 </Button>
              </Col>
              <Col xs={24} xl={8} md={8}>
                <QRCode 
                    size = {256}
                    value={`otpauth://totp/Vaulto:${account.name || ""}?secret=${account.otp_key}&issuer=Vaulto`}>
                </QRCode>
              </Col>
            </Row>
          </div> : null}
          
        </div>
      
    )
  }
}

export default SettingsPage;