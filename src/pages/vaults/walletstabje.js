import React, {Component} from 'react';
import { connect } from 'dva';
import {Button, Layout, Card, Modal, Input, InputNumber, Form, Table, Select, Tag} from 'antd'; 

const {
    Header, Content, Footer, Sider,
  } = Layout;

export default class WalletsTable extends Component{
    render(){
        console.log("WalletsTable",this.props)
        const columns = [
            {
              title : 'Wallets',
              dataIndex: 'name',
              key: 'name'
            },
            {
                title : 'Coowners',
                dataIndex: 'coowners',
                key: 'coowners',
                render: (coowners, record) => {
                    return(coowners.map((x)=>x.username).join(" "))
                }
            },
            {
                title : 'Auditors',
                dataIndex: 'auditors',
                key: 'auditors',
                render: (coowners, record) => {
                    return(coowners.map((x)=>x.username).join(" "))
                }
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
        
          const dataSource = this.props.wallets ? Object.values(this.props.wallets).filter(w => w.seed_id == this.props.seedId) : null;
          console.log("Datasource",dataSource)


         return(
                dataSource ? <Table dataSource={dataSource} columns={columns} rowKey="id" /> : null
         )
    }
}