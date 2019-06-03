import React from 'react'
import PropTypes from 'prop-types'
// import Blockies from 'react-blockies'
import makeBlockie from 'ethereum-blockies-base64'

import { Tag, Popover, Avatar } from 'antd'

import styles from './WalletAvatar.less'

const WalletAvatar = ({ seed = '', cutoff = 16 }) => {
  return (
    <div className={styles.walletAvatar}>
      <Avatar shape="square" size={32} src={makeBlockie(seed)} />
      <span className={styles.seed}>
        <Popover
          content={
            <div className={styles.wallet}>
              Wallet:
              <div>{seed}</div>
            </div>
          }
        >
          <Tag color="gold">{seed.slice(0, cutoff)}..</Tag>
        </Popover>
      </span>
    </div>
  )
}

WalletAvatar.propTypes = {
  wallet: PropTypes.string.isRequired,
  cutoff: PropTypes.number.isRequired,
}

export default WalletAvatar
