import React, {Component} from 'react';
import { connect } from 'dva';
import {Button, Layout, Card, Modal, Input, InputNumber, Form, Table, Select, Tag} from 'antd'; 
import WalletsList from "@/components/WalletsList";
//import CreatePrivateKeyForm from './forms/create';
//import CreatePrivateKeyShareForm from './forms/share';

const {
  Header, Content, Footer, Sider,
} = Layout;

const Option = Select.Option;

const KEY_TYPE_UNKNOWN = 0
const KEY_TYPE_SEED = 1
const KEY_TYPE_ROOT = 2
const KEY_TYPE_SINGLE = 3
const KEY_TYPE_MULTI = 4


//const CreatedPrivateKeyForm = Form.create({"name" : 'create_private_key_form'})(CreatePrivateKeyForm);
//const CreatedPrivateKeyShareForm = Form.create({"name" : 'create_private_key_share_form'})(CreatePrivateKeyShareForm);

@connect(({ userAssets, userKeys, userWallets }) => ({
  userAssets,userKeys,userWallets
}))
class WalletsPage extends Component{
  state = {
      createPrivateKeyModalVisible : false,
      createPrivateKeyShareModalVisible : false,
      keyToShare : null
  }

  constructor(props){
      super(props);
      this.handleAddAddress = this.handleAddAddress.bind(this);
      this.handleOnWalletClick = this.handleOnWalletClick.bind(this);
  }

  componentDidMount(){
    const { dispatch } = this.props;
    const { keys } = this.props.userKeys;
    const { assets } = this.props.userAssets;
    console.log(  "Wallet componentDidMount ", this.props );

    if( Object.keys(assets).length == 0 ){
      dispatch({
        type: 'userAssets/getAssets',
        payload: {}
      });
    }
      
    dispatch({
        type: 'userWallets/getWallets',
        payload: {}
    });
 
  }

  componentDidUpdate(prevProps){
    const { dispatch } = this.props;
    const { keys } = this.props.userKeys;
    const { userWallets } = this.props;

    console.log( "Wallets component did update", prevProps, keys);
    
    if( prevProps.userKeys.keys == undefined && keys){
        const wallets = Object.values(keys).filter(wallet => wallet.private_key_type != 1 );
        console.log( "Wallets component wallets", wallets);

        if(wallets && wallets.length > 0 )
        {
            dispatch({
                type: 'userWallets/setCurrentKey',
                payload: wallets[0],
            });
        }
    }
}

  handleAddAddress(){
    const { dispatch } = this.props;
    const { userWallets } = this.props;
    const { keys } = this.props.userKeys;

    console.log("Handle add address", userWallets);
    if( userWallets.current_key && keys[userWallets.current_key.id]){
        dispatch({
            type: 'userWallets/getAddress',
            payload:  keys[userWallets.current_key.id]
        });
        dispatch({
            type: 'userKeys/getKeys',
            payload:  keys[userWallets.current_key.id]
        });
    }
  }

  handleDeleteKey(id){
    console.log("Handle delete", id);
  }

  handleOnWalletClick(id){
    console.log("Handle OnWalletClick", id);
    const { dispatch } = this.props;
    
    dispatch({
      type: 'userWallets/getAddresses',
      payload: {}
    });

    
  }

  render(){
    console.log('WalletsPage render',this.props);
    const {userAssets, userKeys, userWallets} = this.props;
    const {keys} = userKeys || {};
    const {assets} = userAssets || {};
    const {addresses} = userWallets || {};



    const columns = [
      {
        title : 'Id',
        dataIndex: 'n',
        key: 'n'
      },
      {
        title : 'Address',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title : 'Balance',
        dataIndex: 'balance',
        key: 'balance'
      }
    ]

    const dataSource = addresses ? Object.values(addresses) : null;

    console.log('WalletsPage render',this.props, dataSource);

    return(
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <Modal
          footer={null}
          title="Create private key" 
          visible={this.state.createPrivateKeyModalVisible}
          onCancel = {()=>{this.setState({createPrivateKeyModalVisible:false})}}
        >
        </Modal>

        <Modal
          footer={null}
          title="Create private key" 
          visible={this.state.createPrivateKeyShareModalVisible}
          onCancel = {()=>{this.setState({createPrivateKeyShareModalVisible:false})}}
        >

        </Modal>

        <WalletsList onClick={this.handleOnWalletClick}/>

         <Card>
          <Button onClick={this.handleAddAddress}>Add address</Button>
        </Card> 

        <Card>
          {dataSource ? <Table dataSource={dataSource} columns={columns} rowKey="n" /> : null}
        </Card>

      </Content> 
  )}
}

export default WalletsPage;