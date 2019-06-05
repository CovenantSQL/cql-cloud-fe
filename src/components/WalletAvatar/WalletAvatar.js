import React from 'react'
import PropTypes from 'prop-types'
// import Blockies from 'react-blockies'
import makeBlockie from 'ethereum-blockies-base64'
import { toPTC } from 'utils'

import { Tag, Popover, Avatar } from 'antd'

import styles from './WalletAvatar.less'

const WalletAvatar = ({
  seed = '',
  withAccount = true,
  accountPopoverTigger = 'hover',
  balance = 0,
  withBalance = false,
  balancePopoverTigger = 'hover',
  avatarSize = 32,
  avatarShape = 'square',
  cutoff = 16,
}) => {
  return (
    <div className={styles.walletAvatar}>
      <span className={styles.avatar}>
        {seed && (
          <Avatar
            shape={avatarShape}
            size={avatarSize}
            src={makeBlockie(seed)}
          />
        )}
      </span>
      <Popover
        trigger={accountPopoverTigger}
        content={
          <div className={styles.popover}>
            Wallet:
            <div>{seed}</div>
          </div>
        }
      >
        {withAccount && <Tag color="gold">{seed.slice(0, cutoff)}..</Tag>}
      </Popover>
      <Popover
        trigger={balancePopoverTigger}
        content={
          <div className={styles.popover}>
            Balance:
            <div>{toPTC(balance, 6)} PTC</div>
          </div>
        }
      >
        {withBalance && <Tag color="blue">{toPTC(balance, 2)} PTC</Tag>}
      </Popover>
    </div>
  )
}

WalletAvatar.propTypes = {
  seed: PropTypes.string.isRequired,
  cutoff: PropTypes.number,
}

export default WalletAvatar
