import type { Accessor, Component } from 'solid-js';

import { classNames } from '~/utils';

import styles from './index.module.scss';


type Props = {
  checked: Accessor<boolean>,
  onChange: (checked: boolean) => void,
};

const Switch: Component<Props> = ({ checked, onChange }) => {
  const onClick = () => onChange(!checked());

  return (
    <button
      type={'button'}
      className={classNames(styles.container, checked() ? styles.active : '')}
      data-toggle={'button'}
      aria-pressed={checked()}
      onClick={onClick}
    >
      <div className={styles.thumb} />
    </button>
  );
};

export default Switch;
