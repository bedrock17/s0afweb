import type { Component } from 'solid-js';

import Footer from '~/components/Footer';

import { Container } from './styles';

const Layout: Component = ({ children }) => (
  <Container>
    { children }
    <Footer />
  </Container>
);

export default Layout;
