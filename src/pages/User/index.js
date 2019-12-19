import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import { KPIStoreContext } from '../../contexts/KPIStore';
import NotFound from '../../components/NotFound';
import Loading from '../../components/Loading';
import ShowProfile from './ShowProfile';
import TasksSection from './TasksSection';
import LogChart from './LogChart';
import { makeStyles } from '@material-ui/core/styles';
import GetSprints from '../../utils/GetSprints';
import SelectSprint from '../../components/SelectSprint';
import CompletedSprintsChart from './CompletedSprintsChart';
import ProductiveChart from './ProductiveChart';

const useStyles = makeStyles(theme => ({
  order_1: {
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
    [theme.breakpoints.down('xs')]: {
      order: 2,
    },
  },
  order_2: {
    [theme.breakpoints.up('md')]: {
      order: 2,
    },
    [theme.breakpoints.down('xs')]: {
      order: 1,
    },
  },
}));

export default function User() {
  const classes = useStyles();
  const { id } = useParams();
  const [reloadComponent, setReloadComponent] = useState(0);
  const [sprint, setSprint] = useState(-1);
  const { users: [users],
    boardSprints: [boardSprints, setBoardSprints] } = useContext(KPIStoreContext);
  const user = users.filter((item) => item.id === Number(id))[0];
  const componentIsMounted = useRef(true);

  useEffect(() => {
    if(boardSprints.length === 0) {
      GetSprints()
      .then((results) => {
        if(componentIsMounted.current) {
          setBoardSprints(results.data);
        }
      });
    } else if(sprint === -1) {
      setSprint(boardSprints.filter((item) => item.state === 'active')[0].id);
    }
    return(() => {
      componentIsMounted.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSprints]);

  if(boardSprints.length === 0 || sprint === null) {
    return <Loading width={'100%'} />
  }

  if(user === undefined || boardSprints.length === 0) {
    return <NotFound width={'100%'} />
  }

  const refreshData = () => {
    setReloadComponent((new Date()).getTime());
  }

  const handleChange = () => event => {
    setSprint(parseInt(event.target.value));
  };

  return(
    <Grid container spacing={3}>
      <Grid item xs={12} md={3} className={classes.order_2} >
        {
          (sprint === -1 || boardSprints.length === 0) ?
          ''
          : (
            <>
              <ShowProfile {...user} sprintID={sprint}/>
              <ProductiveChart {...user} />
              <CompletedSprintsChart {...user} />
              <LogChart {...user} />
            </>
          )
        }
      </Grid>
      <Grid item xs={12} md={9} className={classes.order_1} >
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Tooltip title="Refresh Data" aria-label="Refresh Data">
              <Button variant="contained" onClick={refreshData}><RefreshIcon/></Button>
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <div style={{textAlign: "right"}} >
              <SelectSprint value={sprint} onChange={handleChange()}/>
            </div>
          </Grid>
        </Grid>
        <TasksSection {...user} user_id={user.id} sprintID={sprint} reload={reloadComponent} />
      </Grid>
    </Grid>
  );
}
