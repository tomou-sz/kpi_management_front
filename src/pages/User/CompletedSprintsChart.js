import React, {useContext, useEffect} from 'react';
import { Chart } from "react-google-charts";
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { KPIStoreContext } from '../../contexts/KPIStore';
import Loading from '../../components/Loading';
import GetProductivity from '../../utils/GetProductivity';
import StableSort, { getSorting } from '../../utils/StableSort';
import { getHour } from '../../utils/TimeFormat';

const PREV_SPRINT = 6;

export default function CompletedSprintsChart({...props}) {
  const { id, name } = props;
  const { productive: [productive, dispatchProductive],
    boardSprints: [boardSprints] } = useContext(KPIStoreContext);
  const completedSprints = getCompletedSprints(boardSprints).map(item => item.id);
  const completedData = productive.filter(item => completedSprints.indexOf(parseInt(item.target_sprint_id)) !== -1 && item.user_id === id);

  useEffect(() => {
    let promises = completedSprints.map((sprint_id) => {
      return GetProductivity(id, sprint_id).then(results => {
        const productivity = results.data;
        return Object.assign(productivity, {id: id, name: name});
      })
    });
    Promise.all(promises).then(results => {
      dispatchProductive({type: 'ADD_OR_UPDATE_PRODUCTIVE', data: results})
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ChartRender = () => {
    if(completedData.length >= PREV_SPRINT) {
      let chartData = StableSort(completedData, getSorting('asc', 'target_sprint_id')).map(item => {
        return [item.target_sprint_id,
          getHour(item.kpi.main.estimate_total),
          getHour(item.kpi.main.sprint_work_logs_total),
          getHour(item.kpi.main.done_tickets_estimate_total),
          getHour(item.kpi.main.carried_over_logs_total) ]
      });

      // Add table header to worklog
      chartData.unshift(['sprint_id',
        'Estimated',
        'Sprint Work Logs',
        'Done',
        'Carried Over' ]);

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
              chartArea: { width: '80%' },
              legend: { position: 'top', alignment: 'start' },
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

CompletedSprintsChart.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
};
