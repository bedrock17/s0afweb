import React from 'react';

// import { Container, Title } from './styles';

type Props = {
  state: boolean,
  master: string,
};

const Footer = ({ state, master }: Props) => {
  return (
    <>
      <div> Yeah {state} {master}</div>
    </>
  );
};

export default Footer;
