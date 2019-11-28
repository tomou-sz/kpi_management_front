import React from 'react';
import Box from '@material-ui/core/Box';
import styled from "styled-components";
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';

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
        <Typography variant="h5" component="h5">Page Not Found</Typography>
        <Skeleton variant="rect" disableAnimate={true} height={15} width="50%" style={{marginBottom: '0.5rem'}}/>
        <Skeleton variant="rect" disableAnimate={true} height={15} width="20%" style={{marginBottom: '0.5rem'}} />
        <Skeleton variant="rect" disableAnimate={true} height={15} width="30%" />
      </Box>
    </Wrapper>
  );
}
