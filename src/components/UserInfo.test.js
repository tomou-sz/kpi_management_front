import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import UserInfo from './UserInfo';
import { render, fireEvent, cleanup } from '@testing-library/react';

afterEach(cleanup);

const defaultProps = {
  id: 3,
  name: 'Luohao',
  jira_id: 'jakeluong',
  position: 'junior',
  useLink: true,
  onClick: jest.fn()
};

test('UserInfo did renders with correct data and link', () => {
  const { queryByText } = render(
    <BrowserRouter>
      <UserInfo {...defaultProps} />
    </BrowserRouter>
  );
  expect(queryByText('Luohao')).toBeTruthy();
});

test('UserInfo did renders with link and no name', () => {
  const { queryByText } = render(
    <BrowserRouter>
      <UserInfo {...defaultProps} name='' />
    </BrowserRouter>
  )
  expect(queryByText('3')).toBeTruthy();
});

test('UserInfo did renders with correct data', () => {
  const { queryByText } = render(
    <UserInfo {...defaultProps} useLink={false} />
  );
  expect(queryByText('Luohao')).toBeTruthy();
});

test('UserInfo did renders without name', () => {
  const { queryByText } = render(
    <UserInfo {...defaultProps} name='' useLink={false} />
  );
  expect(queryByText('3')).toBeTruthy();
});

test('UserInfo did renders without jira id', () => {
  const { queryByText } = render(
    <UserInfo {...defaultProps} jira_id='' useLink={false} />
  );
  expect(queryByText('Luohao')).toBeTruthy()
});
