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

@connect(({ userAssets, userKeys, userWallets, userFirewall, userAccounts }) => ({
  userAssets,userKeys, userWallets, userFirewall, userAccounts
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
    const { keys } = this.props.userKeys;
    console.log(  "Firewall component ", this.props );

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


  handleDeleteKey(id){
    console.log("Handle delete", id);
  }

  handleAddRule(){
    console.log("Handle AddRule");
    const {dispatch} = this.props;
    const {current_key} = this.props.userWallets;
    dispatch({
      type: 'userFirewall/addFirewallRule',
      payload : {
        private_key : current_key.id,
        amount : 0, 
        address_list : [],
        validation : "",
        period : 0
      }
    });

    dispatch({
      type: 'userWallets/getCurrentKeyInfo',
      payload : {}
    });

  
  }

  render(){
    console.log('FirewallPage render',this.props);
    const {userAssets, userKeys, userWallets} = this.props;
    const {keys} = userKeys || {};
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
          <Option key={a.id.toString()} value={a.id.toString()}>{a.name}</Option>
      )) : [];
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
        dataIndex: 'address_list',
        help : 'Comma-separated address list, * for all addresses',
        key: 'address_list',
        editable : true,
        required : false,
        render : (text, record) => {
          return(text.split(",").map( item=>(item ? <Tag color="green">{item}</Tag> : null)) );
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
        title : 'Signatures required',
        help : 'Signatures required.',
        dataIndex: 'signatures_required',
        key: 'signatures_required',
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
        const participants_list = JSON.parse(firewall_rules[fridx].participants)
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
          {dataSource ? <EditableTable data={dataSource} columns={columns} options={shared_users_options}/> : null}
        </Card>

      </Content> 
  )}
}

export default FirewallPage;
