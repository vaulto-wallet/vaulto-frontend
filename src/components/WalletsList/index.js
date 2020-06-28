import React, { PureComponent, Component } from 'react';
import { connect } from 'dva';
//import styles from './index.less';
import { Card, Row, Col, Modal, Icon, Tooltip } from "antd";
import styles from './index.less';
import TransferModal from "@/components/TransferModal";
import BTC_icon from '../../../node_modules/cryptocurrency-icons/svg/white/btc.svg';
import ETH_icon from '../../../node_modules/cryptocurrency-icons/svg/white/eth.svg';
import TRX_icon from '../../../node_modules/cryptocurrency-icons/svg/white/trx.svg';
import EOS_icon from '../../../node_modules/cryptocurrency-icons/svg/white/eos.svg';
import XRP_icon from '../../../node_modules/cryptocurrency-icons/svg/white/xrp.svg';
import { SwapOutlined, ReloadOutlined} from '@ant-design/icons';


class CurrencyIcon extends PureComponent {
    icons = {
        BTC: BTC_icon,
        BTCT: BTC_icon,
        CBP: ETH_icon,
        ETH: ETH_icon,
        TRX: TRX_icon,
        EOS: EOS_icon,
        XRP: XRP_icon,
    }

    render() {
        const { symbol } = this.props;
        if (!symbol || !this.icons[symbol]) {
            return null;
        }

        return (<img src={this.icons[symbol]}></img>);
    }
}

class WalletCard extends Component {

    constructor() {
        super();
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnTransferClick = this.handleOnTransferClick.bind(this);
    }

    handleOnClick() {
        console.log("Card click", this.props);
        if (this.props.handleClick) {
            this.props.handleClick(this.props.id);
        }
    }

    handleOnTransferClick() {
        console.log("Transfer click", this.props);
        if (this.props.handleClick) {
            this.props.transferClick(this.props.id);
        }
    }


    handleTransfer() {
        console.log("handleTransfer");
    }

    render() {
        return (
            <Card title={this.props.name} className={`${styles.walletcard}`} onClick={this.handleOnClick}
                size="small"
            >
                <Row>
                    <Col>
                        <span className={styles.balance}>{this.props.balance}</span><span className={styles.currency}>{this.props.currency}</span>
                    </Col>
                </Row>
                <div className={`${styles.walleticons}`}>
                    {this.props.transferClick ? <a onClick={this.handleOnTransferClick}><Tooltip title="Transfer"><SwapOutlined/></Tooltip></a> : null}
                    {this.props.transferClick ? <a onClick={this.handleOnTransferClick}><Tooltip title="Refresh balance"><ReloadOutlined/></Tooltip></a> : null}
                </div>
                <div className={`${styles.walletcurrencyname}`}>
                    {this.props.currencyname}
                </div>
                <div className={`${styles.walletcurrencysymbol}`}>
                    <CurrencyIcon symbol={ this.props.currency} />
                </div>
            </Card>
        );
    }
}


@connect(({ userAssets, userVaults, userWallets, userTransfers }) => ({
    userAssets, userVaults, userWallets, userTransfers
}))
export default class WalletsList extends Component {
    state={
        transferModalVisible : false
    }

    constructor() {
        super()
        this.walletClick = this.walletClick.bind(this);
        this.transferClick = this.transferClick.bind(this);
        this.onCancelTransfer = this.onCancelTransfer.bind(this);
        this.onTransferSubmit = this.onTransferSubmit.bind(this); 
        this.state = {
            transferModalVisible: false,
            trnasferModalKeyId: null
        }
    }

    walletClick(id) {
        console.log("WalletList click", id, this.props);
        const { dispatch, onClick } = this.props;
        const { wallets } = this.props.userWallets;

        dispatch({
            "type": "userWallets/setCurrentKey",
            "payload": wallets[id]
        })
        if( onClick ){
            onClick(id);
        }
    }


    transferClick(id) {
        console.log("Transfer click", id);
        const { dispatch } = this.props;

        dispatch({
            "type": "userTransfers/transferForm",
            "payload": id
        })
        this.setState({
            transferModalVisible: true
        })


    }

    renderWalletsList(wallets, walletClickHandler, walletTransferClickHandler) {
        let result = []
        const { assets } = this.props.userAssets;

        console.log("WalletsList renderWalletsList", wallets)
        for (let w of wallets) {
            result.push(
                <Col xs={24} sm={12} md={8} lg={6} xl={6} style={{maxWidth:250}} key={"col" + w.id.toString()}>
                    <WalletCard
                        key={w.id}
                        id={w.id}
                        handleClick={walletClickHandler}
                        transferClick={walletTransferClickHandler}
                        currency={assets[w.asset_id]?.symbol}
                        currencyname={assets[w.asset_id]?.name}
                        balance={w.balance}
                        name={w.name}
                    />
                </Col>
            )
        }
        return result;
    }

    onCancelTransfer() {
        const {dispatch} = this.props;
        console.log("onCancelTransfer");
        dispatch({
            "type": "userTransfers/transferForm",
            "payload": 0
        })

        this.setState({
            transferModalVisible: false
        })
    }

    onTransferSubmit(values) {
        const {userTransfers, dispatch} = this.props;
        const {transferForm} = userTransfers;

        this.setState({
            transferModalVisible: false
        })

        console.log('Received values of form: ', values);
        const { comment, destinations } = values;
        //console.log('Merged values:', keys.map(key => ({address:address[key], amount:parseFloat(amount[key])} )  ));
        //const outs = keys.map(key => ({address:address[key], amount:parseFloat(amount[key])} ));
        /*        
        dispatch(
          {
            type : "userConfirmation/toConfirm",
            payload : {
              type : "userTransfers/createTransfer",
              passwordNotRequired : false,
              payload : values,
            }
        });*/
        const payload = {...values, wallet_id : transferForm}
        dispatch({
            type : "userTransfers/createTransfer",
            passwordNotRequired : false,
            payload : payload,
        })
        console.log(values)
    }

    render() {

        const { wallets } = this.props.userWallets;
        const { transferModalVisible, transferModalKeyId } = this.state;
        console.log("WalletList", this.props);
        let walletsList = []
        if (wallets) {
            walletsList = Object.values(wallets)
        }

        return (
            <div>
                <TransferModal visible={transferModalVisible} handleCancel={this.onCancelTransfer} handleSubmit={this.onTransferSubmit}/> 
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    {this.renderWalletsList(walletsList, this.walletClick, this.transferClick)}
                </Row>
            </div>
        )

    }

}