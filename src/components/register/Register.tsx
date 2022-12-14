import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import ToastUtil from '../../utils/ToastUtil';
import '../login/login.scss';
import LoginSlider from '../loginSlider/LoginSlider';
import Api from '../../api/Api';

export default class RegisterComponent extends Component<{}, State> {
  onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (this.isFormValid()) {
      const { firstName, lastName, bio, imageUrl, university, password, email } = this.state;
      Api.register(firstName, lastName, bio, imageUrl, university, password, email)
        .then(response=>{
          if (response.status === 200) {
            ToastUtil.success("Account created successfully")
            this.setState({redirect: true})
          }
      }).catch(
        response => {
          ToastUtil.error('Email already exists')
        }
      )
    }
  };
  private isFormValid(): boolean {
    return true;
    const { firstName, lastName, bio, imageUrl, university, password, repeatPassword, email } = this.state;
    let hasError = false;
    if (!firstName || !lastName || !bio || !imageUrl || !university || !password || !repeatPassword || !email) {
      ToastUtil.error(" Please complete all the fields");
      hasError = true;
    }
    if (!imageUrl.match(/^https?:\/\/[^ ]*\.[^ ]*$/)) {
      ToastUtil.error("Please enter a valid email address");
      hasError = true;
    }
    if (password !== repeatPassword) {
      ToastUtil.error('Passwords do not math');
      hasError = true;
    }
    return !hasError;
  }
  onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const name = event.target.name as
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'password'
      | 'repeatPassword'
      | 'university'
      | 'imageUrl'
      | 'bio';

    this.setState({ [name]: event.target.value } as any);
  };
  constructor(props: {}) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      repeatPassword: '',
      university: '',
      imageUrl: '',
      bio: '',
      redirect: false
    };
  }
  private isLoggedIn(): boolean {
    return localStorage.getItem("accessToken") !== null && localStorage.getItem("accessToken") !== undefined
  }

  render() {
    if (this.isLoggedIn())
      return <Redirect to={"/"}/>;
    if (this.state.redirect)
      return <Redirect to={'/'}/>;
    return (
      <div>
        <div className="login-page">
          <div className="form">
            <form className="register-form" onSubmit={this.onSubmit}>
              <div className="row">
                <div className="col-6">
                  <input name="firstName" type="text" className="ltr" placeholder="Name" onChange={this.onChange} required />
                </div>
                <div className="col-6">
                  <input
                    name="lastName"
                    type="text"
                    className="ltr "
                    placeholder="Last Name"
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    name="email"
                    type="text"
                    className="ltr"
                    placeholder="Email"
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    name="password"
                    type="password"
                    className="ltr r"
                    placeholder="Password"
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    name="repeatPassword"
                    type="password"
                    className="ltr "
                    placeholder="Password"
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    name="university"
                    type="text"
                    className="ltr"
                    placeholder="University"
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <input
                    name="imageUrl"
                    type="url"
                    className="ltr "
                    placeholder="Affiliation"
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <textarea name="bio" className="ltr" cols={30} rows={5} placeholder="Biography" onChange={this.onChange} required />
                </div>
              </div>

              <button type="submit" className="signup-button">
                Sign Up
              </button>
              <p className="message">
                <span>Do you have an account? </span>
                <Link to="/login">login</Link>
              </p>
            </form>
          </div>
        </div>
        <LoginSlider />
        <footer className="bg-transparent">
          // <span className="footer-text">&#169; ?????????? ???????? ?????? ???????? ?????????? ???? ??????????????????? ??????</span>
        </footer>
      </div>
    );
  }
}

interface State {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  university: string;
  imageUrl: string;
  bio: string;
  redirect: boolean;
}
