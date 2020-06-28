import React, {Component} from 'react';
import { connect } from 'dva';
import {Button, Layout, Card, Modal, Input, InputNumber, Form, Table, Select, Tag, Icon, Tooltip} from 'antd'; 
import CreatePrivateKeyForm from './forms/create';
import CreatePrivateKeyShareForm from './forms/share';
import { supportsGoWithoutReloadUsingHash } from 'history/DOMUtils';
import ConfirmationModal from "@/components/ConfirmationModal";

const {
  Header, Content, Footer, Sider,
} = Layout;

//const ConfirmationModalCreated = Form.create({ name: 'transfer-confirmation-form' })(ConfirmationModal);


class TransfersPage extends Component{
  state = {
  }

  constructor(){
    super();
    this.handleConfirmTransfer = this.handleConfirmTransfer.bind(this);
    this.renderAddress = this.renderAddress.bind(this);
  }

  componentWillMount(){
    const { dispatch } = this.props;
    console.log( this.props );
    dispatch({
      type: 'userAssets/getAssets',
      payload: {},
    });
    dispatch({
      type: 'userWallets/getWallets',
      payload: {},
    });
    dispatch({
      type: 'userAccounts/getAccounts',
      payload: {},
    });
    dispatch({
      type: 'userTransfers/getTransfers',
      payload: {},
    });
  }

  handleConfirmTransfer(id){
    const {dispatch} = this.props;
    console.log("Handle confirmTransfer", id);
    dispatch(
      {
        type : "userConfirmation/toConfirm",
        payload : {
          passwordNotRequired : true,
          type : "userTransfers/createConfirmation",
          payload : {
              request : id
          }
        }
    });

  }

  renderAddress(address){
    const {userWallets, dispatch} = this.props;
    const {validated} = userWallets;
    let color = "blue"
    let icon = "loading";
    let text = "Loading"; 
    if( validated[address] == undefined){
      /*dispatch({
        type : "userWallets/validateAddress",
        payload : {address : address}
      });*/
    }  
    if( validated[address] == 0){
      color = "red";
      icon = "exclamation-circle";
      text = "Unknown address"
    }  
    if( validated[address] == 1){
      color = "green";
      icon = "check-circle";
      text = "Firewall whitelist"
    }  

    return(<Tooltip title={text}><Tag color={color}><span style={{paddingRight:10}}>{address}</span><Icon type={icon}/></Tag></Tooltip>);

  }

  renderOrderStatus(status){
    switch(status){
      case 0: 
       return "Unknown"
      case 1: 
       return "New"
      case 2: 
       return "Confirmed"
      case 3: 
       return "Processing"
      case 4: 
       return "Partially processed"
      case 5: 
       return "Processed"
      case 6: 
       return "Rejected"

    }

  }

  render(){
    console.log('TransfersPage render',this.props);
    const {userAssets, userKeys, userAccounts, userTransfers} = this.props;
    const {keys} = userKeys || {};
    const {assets} = userAssets || {};
    const {accounts} = userAccounts || {};
    const {transfers} = userTransfers || {};

    const columns = [
      {
        title : 'Id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title : 'Destinations',
        dataIndex: 'destinations',
        key: 'destinations',
        render: (outs, record) => (
          <span>
            {
              outs.map(out => {
              const color = 'blue';
              return (
                <span key={out.address_to.toString()}>
                  {out.amount} {record.asset.symbol} <Icon type="arrow-right"/> {this.renderAddress(out.address_to)}
                </span>
              );
            })
          }
          </span>
        )
      },
      {
        title : 'Description',
        key: 'description',
        dataIndex: 'comment',
      },
      {
        title : 'Created by',
        key: 'user',
        dataIndex: 'user',
        render : (text, record)=>(
          <span>
                <Tag color={"green"} key={record["id"].toString()}>
                  {accounts[record.submitted_by].name}
                </Tag>
          </span>
        )
      },
      {
        title : 'Confirmations',
        key: 'confirmations',
        dataIndex: 'confirmations',
        render : (text, record)=>(
          <span>
            {
              record.confirmations.map(confirmation => {
              const color = 'volcano';
              return ( 
                <Tag color={color} key={record.id.toString()}>
                  {accounts[confirmation.user_id].name}
                </Tag>)
              })
            }            
          </span>
        )
      },
      {
      title : 'Status',
      key: 'status',
      dataIndex: 'status',
      render : (value, record)=>(
        <span>
            {this.renderOrderStatus(value)}
        </span>
      )
      },
      {
        title : 'Actions',
        key: 'actions',
        render : (text, record)=>(
          <span>
            {record.status > 1 ? <Button onClick={()=>{this.handleConfirmTransfer(record.id)}}>Confirm</Button> : null}
            {record.status == 1 ? <Button onClick={()=>{this.handleDeleteKey(record.id)}}>Revoke</Button> : null}
          </span>
        )

      }
    ]

    const dataSource = transfers ? transfers : null;

    console.log('TransfersPage render',this.props, dataSource);

    return(
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <Card>
          {dataSource ? <Table dataSource={dataSource} columns={columns} rowKey="id" /> : null}
        </Card>

      </Content> 
  )}
}

export default connect(({ userAssets, userKeys, userAccounts, userTransfers, userConfirmation, userWallets }) => ({
  userAssets,userKeys, userAccounts, userTransfers, userConfirmation, userWallets
}))(TransfersPage);
