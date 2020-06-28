import React, {Component} from "react";
import {Modal, Form} from "antd";
import {connect} from "dva";
import TransferForm from "./forms/transferform"; 




@connect(({ userTransfers, userWallets, userAssets }) => ({
    userTransfers, userWallets, userAssets
}))export default class TransferModal extends Component{
    state = {
        visible : false
    }

    constructor(){
        super();
        this.formRef = React.createRef()
    }

    
    render(){
        const {userTransfers, userWallets, userAssets} = this.props;
        const {transferForm} = userTransfers;
        const {wallets} = userWallets;
        const {assets} = userAssets;

        const {keyid} = this.props;
        console.log("TransferModal", this.props);

        return(
            <div visible={transferForm != undefined}>
                <Modal title="Transfer" 
                        visible={this.props.visible} 
                        onCancel={this.props.handleCancel} 
                        onOk={()=>{
                            this.formRef.current.validateFields().then(values=>{
                                this.props.handleSubmit(values)
                                this.formRef.current.resetFields();
                              })
                        }}
                    >
                    {wallets && assets && wallets[transferForm] && assets[wallets[transferForm].asset_id] ? <h2>Transfer {assets[wallets[transferForm].asset_id].symbol} from {wallets[transferForm].name} </h2> : null }
                    <TransferForm formRef={this.formRef} keyid={transferForm} />
                </Modal>
            </div>
        );
    }

}

