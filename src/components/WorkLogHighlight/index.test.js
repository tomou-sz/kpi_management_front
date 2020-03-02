import React from 'react';
import WorkLogHighlight from './index';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

describe('WorklogHighlight did renders', () => {
  const defaultProps = {
    logtime: {
      total_time_spent: 0,
      date: '2020-02-28'
    }
  };

  test('Component did renders successfully', () => {
    const component = jest.fn(() => {
      const { queryByText } = render(
        <WorkLogHighlight {...defaultProps}  />
      )
      const logtime = queryByText(defaultProps.logtime.total_time_spent.toString()).textContent;
      if(logtime.length > 0 && parseInt(logtime) >= 0) {
        return true;
      }
    });
    component()
    expect(component).toHaveReturnedTimes(1);
  });

  test('Log time is below 0 hours', () => {
    const component = jest.fn(() => {
      const total_time_spent = -1;
      const { queryByText } = render(
        <WorkLogHighlight logtime={{ total_time_spent: total_time_spent }}  />
      )
      const logtime = parseInt(queryByText(total_time_spent.toString()).textContent);
      if(logtime <= -1) {
        return true;
      }
    });
    component()
    expect(component).toHaveReturnedTimes(1);
  });

  test('Component did renders with default logtime', () => {
    const { queryByText } = render(
      <WorkLogHighlight {...defaultProps}  />
    )
    expect(parseInt(queryByText(defaultProps.logtime.total_time_spent.toString()).textContent)).toBe(0);
  });

  test('Log time is below 8 hours', () => {
    const total_time_spent = 1;
    const { queryByText } = render(
      <WorkLogHighlight logtime={{ total_time_spent: total_time_spent }} />
    )
    expect(parseInt(queryByText(total_time_spent.toString()).textContent)).toBeLessThan(8);
  });
})