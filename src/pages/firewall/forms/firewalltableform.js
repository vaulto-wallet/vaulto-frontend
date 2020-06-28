import React, {Component} from 'react';
import { connect } from 'dva';
import { Table, Input, InputNumber, Popconfirm, Form, Select } from 'antd';
import { isTaggedTemplateExpression } from '@babel/types';

const Option = Select.Option;
//const EditableContext = React.createContext();


const getInput = (inputType, options) => {
  if (inputType === 'number') {
    return <InputNumber />;
  }
  if (inputType === 'options') {
    console.log("getInput options", inputType, options )
    return( <Select mode = "multiple" style = { {width: "100%"}} 
    >
        {options.map((a)=><Option key={a.id.toString()} value={a.name.toString()}>{a.name}</Option>)}
    </Select>);
  }
  if (inputType === 'select') {
    return( <Select style = { {width: "100%"}} 
    >
        {options}
    </Select>);
  }

  return <Input />;
};

const EditableCell = ({
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
  })=>{
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return(
      <td {...restProps}>
      {editing ? (
          <Form.Item style={{ margin: 0 }} help={help || ""} name={dataIndex}
              rules= {[
              {
                  required: required,
                  message: `Please Input ${title}!`,
              },
              ]}
              initialValue = {inputType === "options" ?  record[dataIndex].map((a)=>(a)) : record[dataIndex]}>
              {getInput(inputType, options || null) } 
          </Form.Item>
      ) : (
          children
      )}
      </td>
    )
  }
    
  

  @connect(({ userAssets, userWallets, userFirewall, userAccounts }) => ({
    userAssets, userWallets, userFirewall, userAccounts
  }))
  class EditableTable extends Component {
    constructor(props) {
      super(props);
      this.updateFirewallRule = this.updateFirewallRule.bind(this);
      this.state = { data : this.props.data, editingKey: '' };
      this.form = React.createRef();

      this.columns = this.props.columns;
      this.columns.push(
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (text, record) => {
              const { editingKey } = this.state;
              const editable = this.isEditing(record);
              console.log("render record operations", record, editable);
              return editable ? 
                <span>
                    <a
                        href="javascript:;"
                        onClick={() => this.save(this.form.current, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                    </a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
               : 
                <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
                  Edit
                </a>
              ;
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
        const {accounts} = this.props.userAccounts;

        if(!itemData){
          return;
      }

        const accountsByName = Object.values(accounts).reduce((a, b)=>(a[b.name]=b, a),{});

        const participants = itemData.firewall_signatures.map((a)=>(accountsByName[a].id));

        
        //itemData.address_list.map( (item)=>{return {address:item}})

        const payload={
            id : itemKey,
            amount : itemData.amount,
            wallet_id : current_key.id,
            address_type : itemData.address_type,
            period : itemData.period,
            confirmations_required : parseInt(itemData.confirmations_required),
            participants : participants
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
      console.log(form, key)
      this.form.current.validateFields().then((row) => {
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

      const {options, select} = this.props;

      console.log("Editable table", this.state, this.props, this.columns);
  
      const columns = this.columns.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.dataIndex === 'firewall_signatures' ? 'options' : col.dataIndex ===  'address_type' ? 'select' :  'text',
            dataIndex: col.dataIndex,
            options: col.dataIndex === 'firewall_signatures' ? options : col.dataIndex === 'address_type' ? select : null,
            title: col.title,
            help : col.help || null,
            editing: this.isEditing(record),
          }),
        };
      });
      console.log("Editable table columns", columns);
  
      return (
        <Form ref={this.form} component={false}>
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
        </Form>
      );
    }
  }

  export default EditableTable;