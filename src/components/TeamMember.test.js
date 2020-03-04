import React from 'react';
import TeamMember, { getTeam } from './TeamMember';
import { render, cleanup } from '@testing-library/react';

describe('TeamMember did renders', () => {
  afterEach(cleanup);

  test('FE team did renders successfully', () => {
    const { queryByText } = render(
      <TeamMember jira_id='jakeluong' />
    );
    const teamName = getTeam('jakeluong');
    const teamMember = queryByText(teamName).textContent;
    expect(teamMember).toBeTruthy();
  });

  test('Design team did renders successfully', () => {
    const { queryByText } = render(
      <TeamMember jira_id='nguyen_thi_anh_tram' />
    );
    const teamName = getTeam('nguyen_thi_anh_tram');
    const teamMember = queryByText(teamName).textContent;
    expect(teamMember).toBeTruthy();
  });

  test('BE team did renders successfully', () => {
    const { queryByText } = render(
      <TeamMember jira_id='thuanbui' />
    );
    const teamName = getTeam('thuanbui');
    const teamMember = queryByText(teamName).textContent;
    expect(teamMember).toBeTruthy();
  });

  test('QC/QA team did renders successfully', () => {
    const { queryByText } = render(
      <TeamMember jira_id='nguyen_tang_hoang_phi'  />
    );
    const teamName = getTeam('nguyen_tang_hoang_phi');
    const teamMember = queryByText(teamName).textContent;
    expect(teamMember).toBeTruthy();
  });

  test('Infra team did renders successfully', () => {
    const { queryByText } = render(
      <TeamMember jira_id='nguyen_ngoc_linh'  />
    );
    const teamName = getTeam('nguyen_ngoc_linh');
    const teamMember = queryByText(teamName).textContent;
    expect(teamMember).toBeTruthy();
  });

  test('Component did renders when JiraID is missing', () => {
    const { queryAllByText } = render(
      <TeamMember jira_id=''  />
    );
    const teamName = getTeam('');
    expect(teamName).toBe('');
  });
})
