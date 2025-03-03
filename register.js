import React, { Component, Fragment } from "react";
import { createUser } from "../../actions/user";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://shielded-journey-92023.herokuapp.com";

const initialState = {
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  repeatPassword: "",
  role: "",
  showPrivateMenu: false,
  showCompanyMenu: false,
  error: "",
  companyName: "",
  companyArr: [],
  companySelected: false,
  kvkNumber: 0,
};

class SignUpForm extends Component {
  state = initialState;

  signUpValidation = (e) => {
    e.preventDefault();
    const { role, password, repeatPassword } = this.state;

    if (!role) {
      this.setState({ error: "Please select the account type you want to create" });
      return;
    }
    if (!password || password.length < 8) {
      this.setState({ error: "Password should be 8 symbols long or more" });
      return;
    }
    if (password !== repeatPassword) {
      this.setState({ error: "Passwords do not match. Enter passwords one more time.", password: "", repeatPassword: "" });
      return;
    }
    this.canSignUp();
  };

  canSignUp = () => {
    this.props.createUser(this.state);
    this.setState(initialState);
    this.props.history.push("/user");
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleRadioButton = (e) => {
    this.setState({ role: e.target.value });
  };

  showPrivPersMenu = () => {
    this.setState({ showPrivateMenu: true, showCompanyMenu: false, error: "", role: "privatePerson" });
  };

  showMenuForCompany = () => {
    this.setState({ showPrivateMenu: false, showCompanyMenu: true, error: "", role: "agencyManager" });
  };

  searchAgency = () => {
    if (!this.state.companyName.trim()) return;

    axios
      .get(`${baseUrl}/agency/findby?name=${this.state.companyName}`)
      .then((res) => this.setState({ companyArr: res.data }))
      .catch((err) => console.error("Error fetching agencies:", err));
  };

  selectCompany = (companyName) => {
    this.setState({ companyArr: [], companySelected: true, error: "", companyName });
  };

  render() {
    const { error, showPrivateMenu, showCompanyMenu, companyArr, companySelected, role, companyName, password, repeatPassword, username, email, phoneNumber } = this.state;

    return (
      <Fragment>
        <div className="container mt-2">{error && <div className="alert alert-warning">{error}</div>}</div>

        <div className="d-flex flex-row justify-content-center mt-5">
          <div className="col-12 col-md-8 col-lg-6 col-xl-3">
            <div className="card p-5">
              <h4>Sign Up</h4>
              <form onSubmit={this.signUpValidation}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" placeholder="Email" name="email" className="form-control" autoComplete="email" value={email} onChange={this.handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="username">Name & Surname</label>
                  <input type="text" name="username" placeholder="Your First Name & Second Name" className="form-control" autoComplete="name" value={username} onChange={this.handleChange} required />
                  <small className="form-text text-muted">Please, input your First name & Second name</small>
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input type="text" placeholder="Phone Number" name="phoneNumber" className="form-control" value={phoneNumber} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <button type="button" className="btn btn-sm btn-outline-info ml-2 mt-1" onClick={this.showPrivPersMenu}>
                    I am a Private person
                  </button>

                  {showPrivateMenu && <div className="alert alert-success mt-3">You have selected to create a private person's profile</div>}

                  {showCompanyMenu && (
                    <div className="mt-3">
                      <label>
                        Real Estate Company Manager
                        <input type="radio" name="agencyManager" value="agencyManager" autoComplete="organization" onChange={this.handleRadioButton} />
                      </label>
                      <label>
                        Real Estate Company Agent
                        <input type="radio" name="agencyManager" value="agencyAgent" autoComplete="organization" onChange={this.handleRadioButton} />
                      </label>
                    </div>
                  )}

                  {role === "agencyAgent" && (
                    <div className="form-group">
                      <div className="text-center">
                        <label htmlFor="companyName">Company Name</label>
                      </div>
                      <input type="text" name="companyName" placeholder="Company Name" className="form-control" value={companyName} onChange={this.handleChange} required />
                      <div className="text-center">
                        <button type="button" className="btn btn-sm btn-info mt-2" onClick={this.searchAgency}>
                          Search
                        </button>
                      </div>
                      {companyArr.length > 0
                        ? companyArr.map((company, i) => (
                            <button key={i} className="btn btn-sm btn-outline-info mt-1 ml-1" onClick={() => this.selectCompany(company.name)}>
                              {company.name}
                            </button>
                          ))
                        : !companySelected && (
                            <div className="mt-2">
                              <small>
                                <ol>
                                  <li>Input keyword to search for company</li>
                                  <li>Press Search</li>
                                  <li>Select your company name from the list</li>
                                </ol>
                              </small>
                            </div>
                          )}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" placeholder="Password" className="form-control" autoComplete="new-password" value={password} onChange={this.handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="repeatPassword">Repeat Password</label>
                  <input type="password" name="repeatPassword" placeholder="Repeat Password" className="form-control" autoComplete="new-password" value={repeatPassword} onChange={this.handleChange} required />
                </div>
                <div className="form-group">
                  <input type="submit" value="SIGN UP" className="btn btn-md btn-success" />
                </div>
              </form>
              <p>I have an account</p>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.userReducer };
}

export default connect(mapStateToProps, { createUser })(SignUpForm);
