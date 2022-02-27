import type { Component } from 'solid-js';

import talalgo from '~/assets/talalgo.png';

import { Container, Title } from './styles';

const Footer: Component = () => {
  return (
    <Container>
      <Title>Sponsor</Title>
      <img src={talalgo} alt='Talalgo' />
    </Container>
  );
};

export default Footer;
