import React from 'react';

import Footer from '~/components/Footer';

import { Container } from './styles';

const Layout: React.FC = ({ children }) => (
  <Container>
    { children }
    <Footer />
  </Container>
);

export default Layout;
