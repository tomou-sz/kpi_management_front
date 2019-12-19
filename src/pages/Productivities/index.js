import React, { useState, useContext, useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import RefreshIcon from '@material-ui/icons/Refresh';
import Loading from '../../components/Loading';
import NotFound from '../../components/NotFound';
import { Divider } from "@material-ui/core";
import { KPIStoreContext } from '../../contexts/KPIStore';
import GetSprints from '../../utils/GetSprints';
import GetUser from '../../utils/GetUser.js';
import SelectSprint from '../../components/SelectSprint';
import ProductiveSection from './ProductiveSection';
import DefaultConfig from '../../utils/DefaultConfig';
import { CancelToken } from 'axios';

export default function Productivities() {
  const [sprint, setSprint] = useState(-1);
  const source = CancelToken.source();
  const { users: [users, setUsers],
    boardSprints: [boardSprints, setBoardSprints] } = useContext(KPIStoreContext);
  const [reloadComponent, setReloadComponent] = useState(0);

  useEffect(() => {
    if(boardSprints.length === 0) {
      GetSprints({ cancelToken: source.token })
      .then((results) => {
        setBoardSprints(results.data)
      })
    } else if(sprint === -1) {
      setSprint(boardSprints.filter((item) => item.state === 'active')[0].id)
    }

    if(users.length === 0) {
      GetUser({ cancelToken: source.token })
      .then((results) => {
        setUsers(results.data);
      });
    }
    return (() => {
      source.cancel();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, boardSprints])

  if(boardSprints.length === 0 || sprint === null) {
    return <Loading width={'100%'} />
  }

  if(boardSprints.length === 0) {
    return <NotFound width={'100%'} />
  }

  const refreshData = () => {
    setReloadComponent((new Date()).getTime());
  }

  const handleChange = () => event => {
    setSprint(parseInt(event.target.value))
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Tooltip
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <Button
              variant="contained"
              onClick={refreshData}
            >
              <RefreshIcon/>
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={6}>
          <div style={{textAlign: "right"}} >
            <SelectSprint value={sprint} onChange={handleChange()}/>
          </div>
        </Grid>
      </Grid>
      {DefaultConfig.TEAM_LIST.map((team, idx) => {
        return (
          <Grid key={idx} container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" component="h3" color="textSecondary">{team.title}</Typography>
              <ProductiveSection reload={reloadComponent} {...team} sprint_id={sprint} />
              <Divider variant='middle' style={{marginTop: '2rem', marginBottom: '2rem'}} />
            </Grid>
          </Grid>
        );
      })}
    </>
  );
}
