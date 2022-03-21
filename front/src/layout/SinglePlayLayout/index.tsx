import React from 'react';

import Footer from '~/components/Footer';

import { Container } from './styles';

const SinglePlayLayout: React.FC = ({ children }) => (
  <Container>
    { children }
    <Footer />
  </Container>
);

export default SinglePlayLayout;
