import React, {Component} from 'react';
import {Link, Redirect, RouteComponentProps} from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import ToastUtil from '../../utils/ToastUtil';
import './login.scss';
import LoginSlider from '../loginSlider/LoginSlider';
import Api from '../../api/Api';

export default class LoginComponent extends Component<Props, State> {
  private isFormValid(): boolean {
    const {password, username} = this.state;
    if (!password || !username) {
      ToastUtil.error('Please try to complete all the fields');
      return false;
    }
    return true;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      password: '',
      username: '',
      redirectHome: false
    };
  }

  onSubmitLogin = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (this.isFormValid()) {
      // console.log('Login form submitted');
      const {password, username} = this.state;
      Api.login(username, password).then(response => {
        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("userId", username);
          this.setState({redirectHome: true})
        }
      }).catch(response => {
        ToastUtil.error(" Invalid username or password")
      });

    }
  };
  onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({username: event.target.value});
  };
  onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({password: event.target.value});
  };
  private isLoggedIn(): boolean {
    return localStorage.getItem("accessToken") !== null && localStorage.getItem("accessToken") !== undefined
  }
  render() {
    if (this.isLoggedIn() || this.state.redirectHome)
      return <Redirect to={"/"}/>;
    return (
      <div>
        <div className="login-page">
          <div className="form">
            <h1 className="welcome-header">Welcome to Project Duo</h1>
            <form className="register-form" onSubmit={this.onSubmitLogin}>
              <div className="row">
                <div className="col-12">
                  <input
                    name="username"
                    type="text"
                    className="ltr"
                    placeholder="User Name"
                    onChange={this.onUsernameChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    name="password"
                    type="password"
                    className="ltr "
                    placeholder="Password"
                    onChange={this.onPasswordChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="signup-button">Login
              </button>
              <p className="message">
                <span>Dont have an account yet? </span>
                <Link to="/register">Register</Link>
              </p>
            </form>
          </div>
        </div>
        <LoginSlider/>
        <footer className="bg-transparent">
          // <span className="footer-text">&#169; ?????????? ???????? ?????? ???????? ?????????? ???? ??????????????????? ??????</span>
        </footer>
      </div>
    );
  }
}

interface Props extends RouteComponentProps {
  // loginCb: () => void
}

interface State {
  username: string;
  password: string;
  redirectHome: boolean;
}
