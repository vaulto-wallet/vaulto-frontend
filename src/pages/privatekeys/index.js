import React, {Component} from 'react';
import { connect } from 'dva';
import {Button, Layout, Card, Modal, Input, InputNumber, Form, Table, Select, Tag} from 'antd'; 
import CreatePrivateKeyForm from './forms/create';
import CreatePrivateKeyShareForm from './forms/share';

const {
  Header, Content, Footer, Sider,
} = Layout;

const Option = Select.Option;

const KEY_TYPE_UNKNOWN = 0
const KEY_TYPE_SEED = 1
const KEY_TYPE_ROOT = 2
const KEY_TYPE_SINGLE = 3
const KEY_TYPE_MULTI = 4


const CreatedPrivateKeyForm = Form.create({"name" : 'create_private_key_form'})(CreatePrivateKeyForm);
const CreatedPrivateKeyShareForm = Form.create({"name" : 'create_private_key_share_form'})(CreatePrivateKeyShareForm);

@connect(({ userAssets, userKeys, userAccounts }) => ({
  userAssets,userKeys, userAccounts
}))
class PrivateKeysPage extends Component{
  state = {
      createPrivateKeyModalVisible : false,
      createPrivateKeyShareModalVisible : false,
      keyToShare : null
  }

  componentWillMount(){
    const { dispatch } = this.props;
    console.log( this.props );
    dispatch({
      type: 'userAssets/getAssets',
      payload: {},
    });
    dispatch({
      type: 'userKeys/getKeys',
      payload: {},
    });
    dispatch({
      type: 'userAccounts/getAccounts',
      payload: {},
    });
  }

  handleShareKey(id){
    console.log("Handle share", id);
    this.setState(
      {
        keyToShare : id,
        createPrivateKeyShareModalVisible : true
      }
    )
  }
  handleDeleteKey(id){
    console.log("Handle delete", id);
  }

  render(){
    console.log('KeysPage render',this.props);
    const {userAssets, userKeys, userAccounts} = this.props;
    const {keys} = userKeys || {};
    const {assets} = userAssets || {};
    const {accounts} = userAccounts || {}



    const columns = [
      {
        title : 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title : 'Asset',
        dataIndex: 'asset',
        key: 'asset'
      },
      {
        title : 'Balance',
        dataIndex: 'balance',
        key: 'balance'
      },
      {
        title : 'Shared',
        dataIndex: 'shared_keys',
        key: 'shared_keys',
        render: shared => (
          <span>
            {
              shared.map(shared_key => {
              const color = 'volcano';
              return (
                <Tag color={color} key={shared_key.id.toString()}>
                  {accounts[shared_key.owner].name}
                </Tag>
              );
            })
          }
          </span>
        )
      },
      {
        title : 'Actions',
        key: 'actions',
        render : (text, record)=>(
          <span>
            <Button onClick={()=>{this.handleShareKey(record)}}>Share</Button>
            <Button onClick={()=>{this.handleDeleteKey(record)}}>Delete</Button>
          </span>
        )

      }
    ]

    const dataSource = keys ? Object.values(keys) : null;

    console.log('KeysPage render',this.props, dataSource);

    return(
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <Modal
          footer={null}
          title="Create private key" 
          visible={this.state.createPrivateKeyModalVisible}
          onCancel = {()=>{this.setState({createPrivateKeyModalVisible:false})}}
        >
            <CreatedPrivateKeyForm/>
        </Modal>

        <Modal
          footer={null}
          title="Create private key" 
          visible={this.state.createPrivateKeyShareModalVisible}
          onCancel = {()=>{this.setState({createPrivateKeyShareModalVisible:false})}}
        >
            <CreatedPrivateKeyShareForm
                keydata = {this.state.keyToShare}
            />
        </Modal>

         <Card>
          <Button onClick={()=>{this.setState({createPrivateKeyModalVisible:true}) }}>Create key</Button>
        </Card> 

        <Card>
          {dataSource ? <Table dataSource={dataSource} columns={columns} rowKey="id" /> : null}
        </Card>

      </Content> 
  )}
}

export default PrivateKeysPage;