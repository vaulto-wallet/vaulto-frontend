import React, {Component} from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import {Row, Col, Form, Input, InputNumber, Button} from 'antd';



@connect(({ userAccount }) => ({
  userAccount
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
      type: 'userAccount/getAccount',
      payload: {}
    });
    dispatch({
        type: 'userAccount/getOTP',
        payload: {}
    });
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
    const {otp, account} = this.props.userAccount;
    console.log("Render Settings", otp, account)
    return(
      <div style={{ textAlign: 'left' }}>
        
        {otp && otp.secret && account ?
          <div>
            <Row>
              <Col xs={24} xl={8} md={8} >
                <p>{account.name || ""}</p>
                <p>{otp.secret}</p>
                <InputNumber onChange={this.inputCodeChange}/>
                <Button type="primary" onClick={this.confirmCode} >
                      Confirm
                 </Button>
              </Col>
              <Col xs={24} xl={8} md={8}>
                <QRCode 
                    size = {256}
                    value={`otpauth://totp/Waulto:${account.name || ""}?secret=${otp.secret}&issuer=Vaulto`}>
                </QRCode>
              </Col>
            </Row>
          </div> : null}
          
        </div>
      
    )
  }
}

export default SettingsPage;