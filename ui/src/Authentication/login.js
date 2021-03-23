import React, {useState} from 'react';
import axios from 'axios';
import queryString from 'query-string';
import {NavLink, useHistory} from 'react-router-dom';
import {useLocation} from 'react-router';
import {backendPath} from '../config';


require('./auth.css')


function Login() {
    const [values, setValues] = useState({});
    const query = queryString.parse(useLocation().search);
    const [error, setError] = useState(undefined);
    const showRegistrationSuccess = query['success'] === 'true';
    const history = useHistory();

    function submit(e) {
        e.preventDefault();
        axios.post(backendPath + 'authentication/login', values).then((resp) => {
            switch (resp.data['result']) {
                case 'SUCCESS':
                    localStorage.setItem('access_token', resp.data['access_token']);
                    localStorage.setItem('role', resp.data['role']);
                    switch (resp.data['role']) {
                        case 'VOLUNTEER':
                            history.push('/volunteer/' + resp.data['id']);
                            break;
                        default:
                            history.push('/captain');
                    }
                    break;
                default:
                    setError('Unknown username or bad password');
                    break;
            }
        });
    }

    function handleChange(field, value) {
        const lcl = {...values};
        lcl[field] = value;
        setValues(lcl);
    }

    return (
        <div className="padding">
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            {showRegistrationSuccess && error === undefined && (
                <div className="alert alert-success" role="alert">
                    Registration successful, you may now login.
                </div>
            )}
            <form onSubmit={submit}>
                <div className="form-inner">
                    <h2>Login</h2>
                    <div className="form-group">
                        <label htmlFor="email">Email*:</label>
                        <input 
                            type="email"
                            name="email"
                            id="email"
                            onChange={(e) => {
                                handleChange('email', e.target.value);
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password*:</label>
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => {
                                handleChange('password', e.target.value);
                            }}
                        />
                    </div>
                    <input type="submit"  value="Submit"/>

                </div>
            </form>
            <div>
                <NavLink to={'/register'}>Register</NavLink>
            </div>
        </div>
    );
}

export default Login;
