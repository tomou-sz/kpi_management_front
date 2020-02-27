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

test('UserInfo renders without name props', () => {
  const { queryByText } = render(
    <BrowserRouter>
      <UserInfo id={3} />
    </BrowserRouter>
  );
  expect(queryByText('Luohao')).toBeNull();
});

test('UserInfo renders without jira_id props', () => {
  const { queryByText } = render(
    <BrowserRouter>
      <UserInfo id={3} />
    </BrowserRouter>
  );
  expect(queryByText('jakeluong')).toBeNull();
});

test('UserInfo renders without position props', () => {
  const { queryByText } = render(
    <BrowserRouter>
      <UserInfo id={3} />
    </BrowserRouter>
  );
  expect(queryByText('junior')).toBeNull();
});

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

test('should render link to user detail page on click', () => {
  const onClick = jest.fn();
  const { getByText } = render (
    <BrowserRouter>
      <UserInfo {...defaultProps} onClick={onClick} />
    </BrowserRouter>
  );
  expect(getByText(defaultProps.name).getAttribute('href')).toBe('/user/3');
})
