import React, {Component} from 'react';
import { connect } from 'dva';
import {Button, Layout, Card, Modal, Input, InputNumber, Form, Table, Select, Tag} from 'antd'; 
import CreatePrivateKeyForm from './forms/create';
import SharePrivateKeyForm from './forms/share';
import WalletsTable from './walletstabje';

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

@connect(({ userAssets, userVaults, userAccounts, userWallets }) => ({
  userAssets,userVaults, userAccounts, userWallets
}))
class VaultsPage extends Component{
  state = {
      createPrivateKeyModalVisible : false,
      createPrivateKeyShareModalVisible : false,
      keyToShare : null,
  }

  constructor(){
    super();
    this.formRef = React.createRef();
  }

  componentWillMount(){
    const { dispatch } = this.props;
    console.log( this.props );
    dispatch({
      type: 'userAssets/getAssets',
      payload: {},
    });
    dispatch({
      type: 'userVaults/getVaults',
      payload: {},
    });
    dispatch({
      type: 'userAccounts/getAccounts',
      payload: {},
    });
    dispatch({
      type: 'userWallets/getWallets',
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
    const {userAssets, userVaults, userAccounts, userWallets, dispatch} = this.props;
    const {vaults} = userVaults || {};
    const {assets} = userAssets || {};
    const {accounts} = userAccounts || {};
    const {wallets} = userWallets || {};



    const columns = [
      {
        title : 'Name',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title : 'Actions',
        key: 'actions',
        render : (text, record)=>(
          <span>
            {/*<Button onClick={()=>{this.handleShareKey(record)}}>Share</Button>*/}
            <Button onClick={()=>{this.handleDeleteKey(record)}}>Delete</Button>
          </span>
        )

      }
    ]

    const dataSource = vaults ? Object.values(vaults) : null;

    console.log('VaultsPage render',this.props, dataSource);

    return(
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <Modal
          title="Create wallet" 
          visible={this.state.createPrivateKeyModalVisible}
          onCancel = {()=>{this.setState({createPrivateKeyModalVisible:false})}}
          onOk = {()=>{
            this.formRef.current.validateFields().then(values=>{
              console.log(values)
              dispatch({
                type: 'userVaults/createVault',
                payload: values,
              });
              dispatch({
                type: 'userVaults/getVaults',
                payload: {},
              });
              this.setState({createPrivateKeyModalVisible:false})
              this.formRef.current.resetFields();
            })
          }}
          okText = "Create"
          cancelText = "Cancel"
        >
            <CreatePrivateKeyForm formRef={this.formRef}/>
        </Modal>

        <Modal
          footer={null}
          title="Share wallet key" 
          visible={this.state.createPrivateKeyShareModalVisible}
          onCancel = {()=>{this.setState({createPrivateKeyShareModalVisible:false})}}
        >
            <SharePrivateKeyForm 
                keydata = {this.state.keyToShare}
            />
        </Modal>

         <Card>
          <Button onClick={()=>{this.setState({createPrivateKeyModalVisible:true}) }}>Create wallet</Button>
        </Card> 

        <Card>
          {dataSource ? <Table dataSource={dataSource} columns={columns} rowKey="id" expandable={{rowExpandable : () => true, expandedRowRender: record => <WalletsTable seedId={record.id} wallets={wallets} />}} /> : null}
        </Card>

      </Content> 
  )}
}

export default VaultsPage;