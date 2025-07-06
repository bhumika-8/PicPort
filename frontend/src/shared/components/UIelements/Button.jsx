import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = props => {
  const classList = [
    'button',
    props.size === 'small' && 'button--small',
    props.size === 'big' && 'button--big',
    props.inverse && 'button--inverse',
    props.danger && 'button--danger'
  ].filter(Boolean).join(' ');

  if (props.href) {
    return (
      <a className={classList} href={props.href}>
        {props.children}
      </a>
    );
  }

  if (props.to) {
    return (
      <Link to={props.to} exact={props.exact} className={classList}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      className={classList}
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
