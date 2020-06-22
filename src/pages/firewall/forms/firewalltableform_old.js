import React, {Component} from 'react';
import { connect } from 'dva';
import { Table, Input, InputNumber, Popconfirm, Form, Select } from 'antd';
import { isTaggedTemplateExpression } from '@babel/types';

const Option = Select.Option;
const EditableContext = React.createContext();
/*
class EditableCell extends Component {
    getInput = (options) => {
      if (this.props.inputType === 'number') {
        return <InputNumber />;
      }
      if (this.props.inputType === 'options') {
        const {options} = this.props;

        return( <Select mode = "multiple" style = { {width: "100%"}} 
        >
            {options}
        </Select>);
      }
      return <Input />;
    };
  
    renderCell = () => {
      const {
        editing,
        dataIndex,
        title,
        help,
        inputType,
        record,
        index,
        required,
        options,
        children,
        ...restProps
      } = this.props;
        return (
            <td {...restProps}>
            {editing ? (
                <Form.Item style={{ margin: 0 }} help={help || ""} name={dataIndex}>
                    rules= {[
                    {
                        required: required,
                        message: `Please Input ${title}!`,
                    },
                    ]}
                    initialValue = {record[dataIndex]}>
                    {this.getInput(options || null) } 
                </Form.Item>
            ) : (
                children
            )}
            </td>
        );
    };
  
    render() {
      return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
  }*/
  
  @connect(({ userAssets, userKeys, userWallets, userFirewall, userAccounts }) => ({
    userAssets,userKeys, userWallets, userFirewall, userAccounts
  }))
  class EditableTable extends Component {
    constructor(props) {
      super(props);
      this.updateFirewallRule = this.updateFirewallRule.bind(this);
      this.state = { data : this.props.data, editingKey: '' };

      this.columns = this.props.columns;
      this.columns.push(
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
              const { editingKey } = this.state;
              const editable = this.isEditing(record);
              console.log("render record operations", record, editable);
              return editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                  Edit
                </a>
              );
            },
          }          
      );

    }
  
    componentDidUpdate(prevProps, prevState){
        if( this.state.data.length != this.props.data.length){
            this.setState({data: this.props.data});
        }
    }

    isEditing = record => record.key === this.state.editingKey;
  
    cancel = () => {
      this.setState({ editingKey: '' });
    };
  
    updateFirewallRule(itemData, itemKey){
        console.log("updateFirewallRule 0", itemData);
        const {dispatch} = this.props;
        const {current_key} = this.props.userWallets;
        if(!itemData){
            return;
        }
        
        //itemData.address_list.map( (item)=>{return {address:item}})

        const payload={
            id : itemKey,
            amount : itemData.amount,
            private_key : current_key.id,
            address_list : itemData.address_list.length > 0 ? itemData.address_list.split(",").map((item)=>{return {address:item}}) : [],
            firewall_signatures : itemData.firewall_signatures.length > 0 ? itemData.firewall_signatures.map((item)=>{ return {user:item}}) : [],
            period : itemData.period,
            signatures_required : itemData.signatures_required
        }
        console.log("updateFirewallRule", payload, itemData);

        
        dispatch({
            type : "userFirewall/setFirewallRule",
            payload : payload
        })
        
        dispatch({
            type : "userWallets/getCurrentKeyInfo",
            payload : {}
        });

    };

    save(form, key) {
      form.validateFields((error, row) => {
        if (error) {
          return;
        }
        const newData = [...this.state.data];
        const index = newData.findIndex(item => key === item.key);
        if (index > -1) {
          const item = newData[index];
          console.log("newData",row);
          this.updateFirewallRule(row, item.key);
          newData.splice(index, 1, {
            ...item,
            ...row,
          });

          this.setState({ data: newData, editingKey: '' });
        } else {
          newData.push(row);
          this.setState({ data: newData, editingKey: '' });
        }
      });
    }
  
    edit(key) {
      console.log("Edit", key)
      this.setState({ editingKey: key });
    }
  
    render() {
      const components = {
        body: {
          cell: EditableCell,
        },
      };

      const {options} = this.props;

      console.log("Editable table", this.state, this.props, this.columns);
  
      const columns = this.columns.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.dataIndex === 'firewall_signatures' ? 'options' : 'text',
            dataIndex: col.dataIndex,
            options: col.dataIndex === 'firewall_signatures' ? options : null,
            title: col.title,
            help : col.help || null,
            editing: this.isEditing(record),
          }),
        };
      });
  
      return (
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            rowClassName="editable-row"
            rowKey="id"
            pagination={{
              onChange: this.cancel,
            }}
          />
        </EditableContext.Provider>
      );
    }
  }

  export default EditableTable;