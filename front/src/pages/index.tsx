import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';

import styles from '~/components.module.scss';
import Switch from '~/components/Switch';
import { classNames } from '~/utils';

const IndexPage: Component = () => {
  const [checked, setChecked] = createSignal(false);
  return (
    <div>
      <button className={classNames(styles.button, styles.skyblue)}>PLAY!</button>
      <button className={classNames(styles.button, styles.green)}>PLAY!</button>
      <Switch checked={checked} onChange={setChecked} />
    </div>
  );
};

export default IndexPage;
