import React from 'react';
import Box from '@material-ui/core/Box';
import styled from "styled-components";
import Skeleton from '@material-ui/lab/Skeleton';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

export default function Menu({...props}) {
  return (
    <Wrapper>
      <Box {...props} >
        <Skeleton variant="rect" width="100%" height={200} style={{marginBottom: '0.5rem'}}/>
        <Skeleton variant="rect" height={20} style={{marginBottom: '0.5rem'}} />
        <Skeleton variant="rect" height={20} width="60%" />
      </Box>
    </Wrapper>
  );
}
