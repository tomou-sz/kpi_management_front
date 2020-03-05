import React from 'react';
import SelectTeam from './SelectTeam';
import { render, fireEvent, cleanup } from '@testing-library/react';
// import DefaultConfig from '../utils/DefaultConfig';

describe('SelectTeam component test', () => {
  afterEach(cleanup);

  const defaultProps = {
    value: 'TEAM_FE',
    text: 'Frontend'
  };

  beforeEach(() => {
    jest.resetModules();
  });

  test('should renders loading when team list is empty', ()=> {
    jest.mock('../utils/DefaultConfig');
    // const teamListModules = require('../utils/DefaultConfig');
    const { queryByText } = render(
      <SelectTeam {...defaultProps} />
    )
    // console.log(teamListModules);
    expect(queryByText(defaultProps.text)).toBeTruthy();
  })

  test('component did renders successfully', () => {
    const { queryByText } = render(
      <SelectTeam {...defaultProps} />
    )
    expect(queryByText(defaultProps.text)).toBeTruthy();
  });

  test('componen did renders when value is empty', () => {
    const { queryByText } = render(
      <SelectTeam value='' onChange={defaultProps.onChange} />
    )
    expect(queryByText(defaultProps.text)).toBeTruthy();
  });

  test('componen did renders when missing on change function', () => {
    const { queryByText } = render(
      <SelectTeam value={defaultProps.value} />
    )
    expect(queryByText(defaultProps.text)).toBeTruthy();
  });

  test('calls correct function on change', () => {
    const onChange = jest.fn();
    const { container } = render(<SelectTeam {...defaultProps} onChange={onChange} />)
    const selectInput = container.querySelector('select');
    fireEvent.change(selectInput.firstElementChild, { target: { value: 'changed' } })
    expect(selectInput.value).toBe('changed')
  });
})
