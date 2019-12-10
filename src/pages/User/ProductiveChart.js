import React, {useContext, useEffect} from 'react';
import { Chart } from "react-google-charts";
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { KPIStoreContext } from '../../contexts/KPIStore';
import Loading from '../../components/Loading';
import GetProductivity, { calcProductivity } from '../../utils/GetProductivity';
import StableSort, { getSorting } from '../../utils/StableSort';
import { CancelToken } from 'axios';

const PREV_SPRINT = 6;

export default function ProductiveChart({...props}) {
  const { id, name } = props;
  const { productive: [productive, dispatchProductive],
    boardSprints: [boardSprints] } = useContext(KPIStoreContext);
  const completedSprints = getCompletedSprints(boardSprints).map(item => item.id);
  const completedData = productive.filter(item => completedSprints.indexOf(parseInt(item.target_sprint_id)) !== -1 && item.user_id === id);
  const source = CancelToken.source();

  useEffect(() => {
    let promises = completedSprints.map((sprint_id) => {
      return GetProductivity(id, sprint_id, { cancelToken: source.token }).then(results => {
        const productivity = results.data;
        return Object.assign(productivity, {id: id, name: name});
      })
    });
    Promise.all(promises).then(results => {
      dispatchProductive({type: 'ADD_OR_UPDATE_PRODUCTIVE', data: results})
    });
    return (() => {
      source.cancel()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ChartRender = () => {
    if(completedData.length >= PREV_SPRINT) {
      let chartData = StableSort(completedData, getSorting('asc', 'target_sprint_id')).map(item => {
        const total_work_logs = item.total_work_logs;
        const productivity = calcProductivity(item.kpi.main.done_tickets_estimate_total, total_work_logs);
        return [item.target_sprint_id, productivity]
      });

      // Add table header to worklog
      chartData.unshift(['sprint_id', 'Productivities' ]);

      return (
        <Box p={1} width='100%' >
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={chartData}
            options={{
              hAxis: {
                title: `Productivities Last ${PREV_SPRINT} Sprint`,
              },
              vAxis: {
                minValue: 0,
              },
              chartArea: { width: '85%' },
              legend: 'none',
            }}
          />
        </Box>
      )
    } else {
      return <Loading width={300}/>
    }
  }

  return (
    <Box display="flex" justifyContent="center" flexWrap="wrap" m={0} p={0}>
      <ChartRender/>
    </Box>
  );
}

const getCompletedSprints = (boardSprints) => {
  const idx = findIndexByProperty(boardSprints, 'state', 'active')
  return boardSprints.slice(idx - PREV_SPRINT, idx)
}

const findIndexByProperty = (array, property, value) => {
  for(var i = 0; i < array.length; i += 1) {
    if(array[i][property] === value) {
      return i;
    }
  }
  return -1;
};

ProductiveChart.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
};
