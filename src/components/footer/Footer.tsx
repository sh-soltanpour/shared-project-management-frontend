import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import './footer.scss';

export default class Footer extends Component<Props, {}> {
  render() {
    if (this.props.location.pathname === '/login' || this.props.location.pathname === '/register') return null;
    return (
      <footer>
        <span>All rights reserved for Kotlet team &#169;</span>
      </footer>
    );
  }
}

interface Props extends RouteComponentProps {}
