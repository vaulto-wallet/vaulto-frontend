import React, {Component} from 'react';
import { connect } from 'dva';
import {Button, Layout, Card, Modal, Input, InputNumber, Form, Table, Select, Tag} from 'antd'; 
import WalletsList from "@/components/WalletsList";
import EditableTable from "./forms/firewalltableform";

const {
  Header, Content, Footer, Sider,
} = Layout;

const Option = Select.Option;

const KEY_TYPE_UNKNOWN = 0
const KEY_TYPE_SEED = 1
const KEY_TYPE_ROOT = 2
const KEY_TYPE_SINGLE = 3
const KEY_TYPE_MULTI = 4


//const EditableFormTable = Form.create()(EditableTable);

@connect(({ userAssets, userVaults, userWallets, userFirewall, userAccounts, userAccount }) => ({
  userAssets,userVaults, userWallets, userFirewall, userAccounts, userAccount
}))
class FirewallPage extends Component{
  state = {
  }

  constructor(props){
      super(props);
      this.handleAddRule = this.handleAddRule.bind(this);
  }

  componentDidMount(){
    
    const { dispatch } = this.props;
    console.log(  "Firewall component ", this.props );

    dispatch({
      type : "userAccount/getAccount",
      payload : {}
    })

    dispatch({
      type : "userAssets/getAssets",
      payload : {}
    })

    dispatch({
      type : "userAccounts/getAccounts",
      payload : {}
    })

    dispatch({
        type: 'userWallets/getWallets',
        payload: {}
    });
 
  }

  componentDidUpdate(prevProps){
    const { dispatch } = this.props;
    const { userWallets } = this.props;
    const { wallets } = userWallets;

    console.log( "Wallets component did update", prevProps);
    
    console.log( "Wallets component wallets", wallets);

    if(wallets && wallets.length > 0 )
    {
            dispatch({
                type: 'userWallets/setCurrentKey',
                payload: wallets[0],
            });
    }
}


  handleDeleteKey(id){
    console.log("Handle delete", id);
  }

  handleAddRule(){
    console.log("Handle AddRule");
    const {dispatch} = this.props;
    const {current_key} = this.props.userWallets;
    const {account} = this.props.userAccount;
    dispatch({
      type: 'userFirewall/addFirewallRule',
      payload : {
        wallet_id : current_key.id,
        participant_type : 1, 
        participants : [account.id],
        confirmations_required : 0,
        address_type : 1,
        amount : 0, 
        period : 0,
      }
    });

    dispatch({
      type: 'userWallets/getCurrentKeyInfo',
      payload : {}
    });

  
  }

  renderAllowedAddressType(addressType){
    switch(addressType){
      case 1:
          return "Disabled"
      case 1:
          return "Internal"
      case 2:
          return "External"
      case 3:
          return "Whitelisted"
    }
    return "Unknown"
  }


  renderAllowedAddressTypeOptions(){
    return(
      [
      <Option key="address_type-0" value="0">Disabled</Option>,
      <Option key="address_type-1" value="0">Internal</Option>,
      <Option key="address_type-2" value="2">External</Option>,
      <Option key="address_type-3" value="3">Whitelisted</Option>,
      ]
    )
  }

  


  render(){
    console.log('FirewallPage render',this.props);
    const {userAssets, userWallets} = this.props;
    const {assets} = userAssets || {};
    const {wallet_info} = userWallets || {};
    const {firewall_rules} = wallet_info || [];
    const { accounts } = this.props.userAccounts || {};
    const { keydata } = this.props;

    console.log('FirewallPage render Rules',firewall_rules);

    let shared_users_options = [];
    let shared_users = "";

    if( accounts && firewall_rules && accounts){
      shared_users_options = accounts ? Object.values(accounts).map( a => (
          //<Option key={a.id.toString()} value={a.id.toString()}>{a.name}</Option>
          a
      ))  : [];
    }

    console.log(shared_users_options, shared_users);

    const columns = [
      {
        title : 'Id',
        dataIndex: 'id',
        key: 'id',
        editable : false
      },
      {
        title : 'Allowed addresses',
        dataIndex: 'address_type',
        help : 'Target address type',
        key: 'address_type',
        editable : true,
        required : false,
        render : (value, record) => {
          return(<Tag color="green">{this.renderAllowedAddressType(value)}</Tag> );
        }
      },
      {
        title : 'Amount',
        help : 'Enter maximum allowed amount of coins. * for unlimited',
        dataIndex: 'amount',
        key: 'amount',
        editable : true,
        required : false
      },
      {
        title : 'Period',
        help : 'Maximul allowed period in hours. * for one time check',
        dataIndex: 'period',
        key: 'period',
        editable : true,
        required : false
      },
      {
        title : 'Confirmations required',
        help : 'Confirmations required.',
        dataIndex: 'confirmations_required',
        key: 'confirmations_required',
        editable : true,
      },
      {
        title : 'Approved signatures',
        render: (text, record) => {
          console.log("Render apsign", text, record, this);
          return(<div>{record.firewall_signatures && record.firewall_signatures.length > 0 ? 
            record.firewall_signatures.map( item=>{ return <Tag key={"tg_"+item.toString()} color="blue">{item}</Tag>} ) : "No signatures" }</div>);
        }, 
        help : 'Approved users. * for single signature of transaction initiator',
        dataIndex: 'firewall_signatures',
        key: 'firewall_signatures',
        editable : true,
      }
    ]


    let dataSource = [];
    if(firewall_rules && accounts){
      for(let fridx in firewall_rules)
      {
        console.log(fridx,  firewall_rules[fridx]);
        let rule = Object.assign({},firewall_rules[fridx]);
        rule["key"] = firewall_rules[fridx].id;
        const participants_list = firewall_rules[fridx].participants;
        rule["firewall_signatures"] = participants_list.map(item=>(accounts[item].name.toString()));
        //rule["address_list"] = firewall_rules[fridx].address_list.map(item=>(item.address)).join(",");
        rule["address_list"] = "internal";
        dataSource.push(rule);
      }
    } 


    console.log('FirewallPage render',this.props, dataSource);

    return(
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        <WalletsList/>

         <Card>
           <Button onClick={this.handleAddRule}>Add rule</Button>
         </Card> 

        <Card>
          {dataSource ? <EditableTable data={dataSource} columns={columns} options={shared_users_options} select={this.renderAllowedAddressTypeOptions()} /> : null}
        </Card>

      </Content> 
  )}
}

export default FirewallPage;
