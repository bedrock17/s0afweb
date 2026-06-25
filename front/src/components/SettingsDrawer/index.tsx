import React, {
  PropsWithChildren, memo, useEffect, useState
} from 'react';

import {
  Bar,
  CloseButton,
  Content,
  FloatingButton,
  Header,
  Scrim,
  Sheet,
  Title,
} from './styles';

type Props = PropsWithChildren<{
  title?: string,
}>;

const SettingsDrawer = ({ title = '설정', children }: Props) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <FloatingButton
        type={'button'}
        data-open={open}
        aria-label={'설정 열기'}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Bar />
        <Bar />
        <Bar />
      </FloatingButton>
      <Scrim open={open} onClick={() => setOpen(false)} />
      <Sheet open={open} role={'dialog'} aria-modal={'true'} aria-label={title}>
        <Header>
          <Title>{title}</Title>
          <CloseButton type={'button'} onClick={() => setOpen(false)}>
            닫기
          </CloseButton>
        </Header>
        <Content>{children}</Content>
      </Sheet>
    </>
  );
};

export default memo(SettingsDrawer);
