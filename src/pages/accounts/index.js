import {Component} from 'react';
import {connect} from 'dva';
import {Button, Layout, Card, Modal, Input, InputNumber, Form, Table, Select, Tag} from 'antd'; 
import UserEditForm from "./forms/userform";
const {
    Header, Content, Footer, Sider,
  } = Layout;
  

//const UserEditFormCreated = Form.create({ name: 'user_edit_form' })(UserEditForm); 


class AccountsPage extends Component{
    state={
        userFormVisible : true,
        onOk : null, 
        fields : {}
    }

    constructor(){
        super();
        this.createGroups = this.createGroups.bind(this);
        this.createWorker = this.createWorker.bind(this);
        this.createWorkerOnOk = this.createWorkerOnOk.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
    }

    componentDidMount(){
        const {dispatch} = this.props;
        dispatch({
            type : "userAccounts/getAccounts",
            payload :{}
        })
        dispatch({
            type : "userAccounts/getUsers",
            payload :{}
        }),
        dispatch({
            type : "userAccounts/getWorkerStatus",
            payload :{}
        })
    }

    createGroups(){
        const {dispatch} = this.props;
        dispatch({
            type :"userAccounts/createGroups",
            payload : {}
        })
    }

    createWorkerOnOk(values){
        console.log("createWorkerOnOk", values);
        const {dispatch} = this.props;
        dispatch({
            type :"userAccounts/createWorker",
            payload : {"master_password" : values.password}
        })
    }
    
    createWorker(){
        this.setState({
            userFormVisible : true,
            onOk : this.createWorkerOnOk,
            fields : {password : true}
        });
    }

    handleDeleteUser(user_id){
        const {dispatch} = this.props;
        dispatch({
            type : "userAccounts/deleteUser",
            payload : {id : user_id}
        });
    }


    render(){
        const {accounts, users, groups, worker} = this.props.userAccounts;
        const {userFormVisible} = this.state;

        console.log("accountsPage", this.props);
        const columns_accounts = [
            {
              title : 'User ID',
              dataIndex: 'user',
              key: 'user'
            },
            {
              title : 'Name',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title : 'Actions',
              key: 'actions',
              render : (text, record)=>(
                <span>
                  {!record.is_confirmed ? <Button onClick={()=>{this.handleConfirmTransfer(record.id)}}>Confirm</Button> : null}
                  {record.is_confirmed ? <Button onClick={()=>{this.handleDeleteKey(record.id)}}>Revoke</Button> : null}
                </span>
              )
      
            }
          ];
          const columns_users = [
            {
              title : 'User ID',
              dataIndex: 'id',
              key: 'id'
            },
            {
              title : 'Login',
              dataIndex: 'username',
              key: 'username',
            },
            {
                title : 'E-mail',
                dataIndex: 'email',
                key: 'email',
            },
            {
              title : 'Actions',
              key: 'actions',
              render : (text, record)=>(
                <span>
                  <Button onClick={()=>{this.handleConfirmTransfer(record.id)}}>Edit</Button>
                  <Button onClick={()=>{this.handleDeleteUser(record.id)}}>Delete</Button>
                </span>
              )
      
            }
          ];      
        const dataSource_accounts = accounts ? Object.values(accounts) : null;
        const dataSource_users = users ? Object.values(users) : null;


        return(
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                {/*<UserEditFormCreated groups={this.state.groups} fields={this.state.fields} visible={userFormVisible} onCancel={()=>{this.setState({userFormVisible : false})}} 
                    onOk = {this.state.onOk}/>*/}
                <Card>
                    { !groups || groups.length ==0 ? <Button onClick={this.createGroups}>Create groups</Button> : null}
                    { !worker || !worker.created ? <Button onClick={this.createWorker}>Create worker</Button> : null}
                </Card>
                
                <Card>
                    <h1>Users</h1>
                    {dataSource_users ? <Table dataSource={dataSource_users} columns={columns_users} rowKey="id" /> : null}
                </Card>
                <Card>
                    <h1>Accounts</h1>
                    {dataSource_accounts ? <Table dataSource={dataSource_accounts} columns={columns_accounts} rowKey="user" /> : null}
                </Card>
    
            </Content> 
                
        )
    }

}

export default connect(({ userKeys, userAccounts, userAccount }) => ({
    userKeys, userAccounts, userAccount
}))(AccountsPage);
