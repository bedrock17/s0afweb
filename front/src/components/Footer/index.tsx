import React from 'react';

import talalgo from '~/assets/talalgo.png';

import { Container, Title } from './styles';

const Footer = () => {
  return (
    <Container>
      <Title>Sponsor</Title>
      <img src={talalgo} alt='Talalgo' />
    </Container>
  );
};

export default Footer;
