import clsx from 'clsx';
import React from 'react';

import styles from './Speaker.module.scss';

function Speaker(props) {
  return (
    <div className={clsx(styles.wrapper, { [styles.speaking]: props.speaking })}>
      <img src={props.avatar} className={styles.avatar} />
      <div className={styles.name}>{props.name}</div>
      <div className={styles.twitter}>@{props.twitter}</div>
      <div className={styles.description}>{props.description}</div>
    </div>
  )
}

export default Speaker
