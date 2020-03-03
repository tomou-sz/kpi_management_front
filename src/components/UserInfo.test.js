import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import UserInfo from './UserInfo';
import { render, fireEvent, cleanup, waitForElement } from '@testing-library/react';

describe('UserInfo did renders', () => {
  afterEach(cleanup);

  const defaultProps = {
    id: 3,
    name: 'Luohao',
    useLink: true,
    jira_id: 'jakeluong',
    position: 'junior'
  }

  test('UserInfo did renders with full data', () => {
    const { queryAllByText } = render(
      <BrowserRouter>
        <UserInfo {...defaultProps} />
      </BrowserRouter>
    );
    expect(queryAllByText(defaultProps.jira_id)).toBeTruthy();
  });

  test('UserInfo did renders without name', () => {
    const { queryByText } = render(
      <BrowserRouter>
        <UserInfo {...defaultProps} name='' />
      </BrowserRouter>
    );
    expect(queryByText(defaultProps.id.toString()).textContent).toBe(defaultProps.id.toString());
  });

  test('UserInfo did renders without link', () => {
    const { getByText } = render(
      <BrowserRouter>
        <UserInfo {...defaultProps} useLink={false} />
      </BrowserRouter>
    );
    expect(getByText(defaultProps.name)).toBeTruthy();
  });

  test('UserInfo did renders without jira_id', () => {
    const { getByText } = render(
      <BrowserRouter>
        <UserInfo {...defaultProps} useLink={false} jira_id='' />
      </BrowserRouter>
    );
    expect(getByText(defaultProps.name)).toBeTruthy();
  });

  test('UserInfo did renders by using id', () => {
    const { queryAllByText } = render(
      <BrowserRouter>
        <UserInfo {...defaultProps} useLink={false} name='' />
      </BrowserRouter>
    );
    expect(queryAllByText(defaultProps.jira_id)).toBeTruthy();
  });

  test('should render link to user detail page on click', () => {
    const { getByText } = render (
      <BrowserRouter>
        <UserInfo {...defaultProps}  />
      </BrowserRouter>
    );
    expect(getByText(defaultProps.name).getAttribute('href')).toBe('/user/3');
  });

  test('should render tooltip on hover', async () => {
    // Fix material tooltips document.createRange is not a function
    var cacheCreateRange = document.createRange;
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: "BODY",
        ownerDocument: document,
      },
    });

    const { getByText } = render(
      <BrowserRouter>
        <UserInfo {...defaultProps} />
      </BrowserRouter>
    )
    fireEvent.mouseEnter(getByText(defaultProps.name));
    const tooltipElement = await waitForElement(() => getByText(`Frontend Member - ${defaultProps.position}`));
    expect(tooltipElement).toBeTruthy();

    // Fix material tooltips document.createRange is not a function
    document.createRange = cacheCreateRange;
  })
})
