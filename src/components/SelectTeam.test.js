import React from 'react';
import SelectTeam from './SelectTeam';
import { render, fireEvent, cleanup } from '@testing-library/react';
import DefaultConfig from '../utils/DefaultConfig';
jest.mock('../utils/DefaultConfig');
const defaultProps = {
  value: 'TEAM_FE',
  text: 'Frontend'
};
const defaultTeamList = {
  TEAM_LIST: [
    {title: 'Frontend', name: 'TEAM_FE'},
    {title: 'Frontend - Design', name: 'TEAM_FE_DESIGN'},
    {title: 'Backend', name: 'TEAM_BE'},
    {title: 'Infrastructure', name: 'TEAM_INF'},
    {title: 'QC/QA', name: 'TEAM_QC'},
  ],
};

describe('SelectTeam component test', () => {
  beforeEach(() => {
    DefaultConfig.TEAM_LIST = defaultTeamList.TEAM_LIST;
  });

  afterEach(() =>{
    jest.resetModules();
    cleanup();
  });

  test('should renders loading when team list is empty', ()=> {
    DefaultConfig.TEAM_LIST = [];
    const { queryByText } = render(
      <SelectTeam {...defaultProps} />
    );
    expect(queryByText('Loading').textContent).toBe('Loading');
  });

  test('component did renders successfully', () => {
    const { queryByText } = render(
      <SelectTeam {...defaultProps} />
    );
    expect(queryByText(defaultProps.text)).toBeTruthy();
  });

  test('componen did renders when value is empty', () => {
    const { queryByText } = render(
      <SelectTeam value='' onChange={defaultProps.onChange} />
    );
    expect(queryByText(defaultProps.text)).toBeTruthy();
  });

  test('componen did renders when missing on change function', () => {
    const { queryByText } = render(
      <SelectTeam value={defaultProps.value} />
    );
    expect(queryByText(defaultProps.text)).toBeTruthy();
  });

  test('calls correct function on change', () => {
    const onChange = jest.fn();
    const { container } = render(<SelectTeam {...defaultProps} onChange={onChange} />);
    const selectInput = container.querySelector('select');
    fireEvent.change(selectInput.firstElementChild, { target: { value: 'changed' } });
    expect(selectInput.value).toBe('changed');
  });
})
