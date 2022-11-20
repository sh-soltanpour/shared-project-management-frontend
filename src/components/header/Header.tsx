import React, { Component } from 'react';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import './header.scss';

export default class Header extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }
  logout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    localStorage.clear();
    this.props.history.push("/login");
  };
  render() {
    if (this.props.location.pathname === '/login' || this.props.location.pathname === '/register') return null;

    return (
      <header>
        <div className="container h-100">
          <div id="header" className="row align-items-center justify-content-between">

            <nav className="col-auto row align-items-center">
              <div id="profile" className="col-auto clickable">
                <Link className="header-item" to="/">Home</Link>
              </div>
              <div id="logout" className="col-auto clickable">
                <span onClick={this.logout}>Logout</span>
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  }
}
interface Props extends RouteComponentProps {}
interface State {
}
