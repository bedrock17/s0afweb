import React from 'react';

import talalgo from '~/assets/talalgo.png';

import { Container, Title } from './styles';

const Footer = () => {
  return (
    <Container>
      <Title>Sponsor</Title>
      <a href={'https://panty.run'}>
        <img src={talalgo} alt='Talalgo' />
      </a>
    </Container>
  );
};

export default Footer;
