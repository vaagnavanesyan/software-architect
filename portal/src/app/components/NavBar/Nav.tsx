import * as React from 'react';
import {
  BsBriefcase,
  BsFillPersonFill,
  BsFillPersonPlusFill,
} from 'react-icons/bs';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { isAuthorized } from 'utils/api-request';

export function Nav() {
  const isSignedIn = isAuthorized();
  return (
    <Wrapper>
      {isSignedIn ? (
        <Item to={process.env.PUBLIC_URL + '/profile'}>
          <BsBriefcase className="icon" />
          Profile
        </Item>
      ) : (
        <>
          <Item to={process.env.PUBLIC_URL + '/signin'}>
            <BsFillPersonFill className="icon" />
            Sign In
          </Item>
          <Item to={process.env.PUBLIC_URL + '/signin'}>
            <BsFillPersonPlusFill className="icon" />
            Sign Up
          </Item>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  margin-right: -1rem;
`;

const Item = styled(Link)`
  color: ${p => p.theme.primary};
  cursor: pointer;
  text-decoration: none;
  display: flex;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }

  .icon {
    margin-right: 0.25rem;
  }
`;