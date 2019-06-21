import React from 'react'
import PropTypes from 'prop-types'
import { Button, Avatar } from 'antd'
import CountUp from 'react-countup'
import Link from 'umi/link'
import { Color, toPTC } from 'utils'
import styles from './user.less'

const countUpProps = {
  start: 0,
  duration: 2.75,
  useEasing: true,
  useGrouping: true,
  separator: ',',
}

function User({ avatar, username, projectNum = 0, ptc = 0 }) {
  return (
    <div className={styles.user}>
      <div className={styles.header}>
        <div className={styles.headerinner}>
          <Avatar size="large" src={avatar} />
          <h5 className={styles.name}>{username}</h5>
        </div>
      </div>
      <div className={styles.number}>
        <div className={styles.item}>
          <p># Projects</p>
          <p style={{ color: Color.green }}>
            <CountUp end={projectNum} prefix="" {...countUpProps} />
          </p>
        </div>
        <div className={styles.item}>
          <p>Current Wallet PTC</p>
          <p style={{ color: Color.blue }}>
            <CountUp
              end={toPTC(ptc)}
              suffix=" PTC"
              {...countUpProps}
              decimals={2}
            />
          </p>
        </div>
      </div>
      <div className={styles.footer}>
        <Link to="/wallets">
          <Button type="ghost" size="large">
            Change Wallet
          </Button>
        </Link>
      </div>
    </div>
  )
}

User.propTypes = {
  avatar: PropTypes.string,
  username: PropTypes.string,
  sales: PropTypes.number,
  sold: PropTypes.number,
}

export default User
