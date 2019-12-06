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
import SelectSprint from '../../components/SelectSprint';
import ProductiveSection from './ProductiveSection';


const TeamList = [
  {title: 'Frontend', name: 'TEAM_FE'},
  {title: 'Backend', name: 'TEAM_BE'},
  {title: 'Infrastructure', name: 'TEAM_INF'},
  {title: 'QC/QA', name: 'TEAM_QC'},
];

export default function Productivities() {
  const [sprint, setSprint] = useState(null);
  const { boardSprints: [boardSprints, setBoardSprints] } = useContext(KPIStoreContext);
  const [reloadComponent, setReloadComponent] = useState(0);

  useEffect(() => {
    if(boardSprints.length === 0) {
      GetSprints()
      .then((results) => {
        setBoardSprints(results.data)
      })
    } else {
      setSprint(boardSprints.filter((item) => item.state === 'active')[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSprints])

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
      {TeamList.map((team, idx) => {
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
