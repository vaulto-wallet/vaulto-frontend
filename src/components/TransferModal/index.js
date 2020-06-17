import React, {Component} from "react";
import {Modal, Form} from "antd";
import {connect} from "dva";
import TransferForm from "./forms/transferform"; 



const TransferFormCreated = Form.create({ name: 'dynamic_form_item' })(TransferForm);


@connect(({ userTransfers }) => ({
    userTransfers
}))export default class TransferModal extends Component{
    state = {
        visible : false
    }

    constructor(){
        super();
    }


    componentDidUpdate(){
        console.log("TransferModal", this.props);
        if( this.state.visible != this.props.visible ){
            this.setState({
                visible : this.props.visible
            });
        }
    }
    
    render(){
        const {transferForm} = this.props.userTransfers;
        const {keyid} = this.props;
        console.log("TransferModal", this.props);

        return(
            <div>
                <TransferFormCreated keyid={transferForm} visible={transferForm != undefined}/>
            </div>
        );
    }

}

