import { FormLabel } from 'app/components/FormLabel';
import { PageWrapper } from 'app/components/PageWrapper';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getProfile, updateProfile } from 'utils/api-request';
const initialState = {
  email: '',
  firstName: '',
  lastName: '',
};

export function Profile() {
  const [{ email, firstName, lastName }, setProfile] = useState(initialState);
  useEffect(() => {
    getProfile().then(setProfile);
  }, []);
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    updateProfile(firstName, lastName);
  };
  return (
    <>
      <Helmet>
        <title>{email} Profile</title>
        <meta name="description" content="FaceSystems Portal" />
      </Helmet>
      <PageWrapper>
        <form onSubmit={handleSubmit}>
          <FormLabel htmlFor="firstName">First Name: </FormLabel>
          <p>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={e =>
                setProfile({ email, lastName, firstName: e.target.value })
              }
            />
          </p>
          <FormLabel htmlFor="lastName">Last Name: </FormLabel>
          <p>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={e =>
                setProfile({ email, firstName, lastName: e.target.value })
              }
            />
          </p>
          <input type="submit" value="Update" />
        </form>
      </PageWrapper>
    </>
  );
}