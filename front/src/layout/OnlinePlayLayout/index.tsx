import React from 'react';

import Footer from '~/components/Footer';

import { Container } from './styles';

const OnlinePlayLayout: React.FC = ({ children }) => (
  <Container>
    { children }
  </Container>
);

export default OnlinePlayLayout;
