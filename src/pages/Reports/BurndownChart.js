import React, {useState, useEffect, useRef} from 'react';
import { Chart } from "react-google-charts";
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { GetTotalRemainStoryPoints, GetTotalTimeTrack } from '../../utils/GetReports';
import ErrorBoundary from '../../utils/ErrorBoundary';
import Skeleton from '@material-ui/lab/Skeleton';
import { getWeekends, getDaysBetween, getHour } from '../../utils/TimeFormat';
import { FormControl, FormControlLabel, RadioGroup, Radio } from '@material-ui/core';
import { CancelToken } from 'axios';

const optionStoryPoint = {
  seriesType: 'steppedArea', //'steppedArea',
  areaOpacity: 0,
  colors: ['red', 'blue'],
  legend: {
    position: 'bottom',
    alignment: 'start'
  },
  interpolateNulls: true,
  chartArea: { width: '90%' },
  series: {
    1: {
      type: 'line',
      color: '#bfbfbf',
      visibleInLegend: false,
    }
  },
  hAxis: {
    gridlines: {
      color: '#fff',
      count: -1,
      units: {
        days: {format: ['MMM dd']},
        hours: {format: ['HH:mm', 'ha']},
      }
    },
  },
};

const optionRemainTime = Object.assign({}, optionStoryPoint);
optionRemainTime.series = {
  2: {
    type: 'line',
    color: '#bfbfbf',
    visibleInLegend: false,
  }
};

export default function BurndownChart({...props}) {
  const {user_ids, sprint_id, startDate, endDate} = props;
  const source = CancelToken.source();
  const componentIsMounted = useRef(true);
  const [googleObject, setGoogleObject] = useState(window.google);
  const [layout, setLayout] = useState('remain_time');
  const [remainTime, setRemainTime] = useState([]);
  const [storyPoints, setStoryPoints] = useState([]);

  useEffect(() => {
    const func = layout === 'remain_time' ? GetTotalTimeTrack : GetTotalRemainStoryPoints;
    func({
      params: {
        user_ids: user_ids,
        sprint_id: sprint_id,
        cancelToken: source.token,
      }
    }).then((results) => {
      if(componentIsMounted.current) {
        if(layout === 'remain_time') {
          setRemainTime(results.data.total_time_trackings);
        } else {
          setStoryPoints(results.data.total_remaining_story_points);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_ids, sprint_id, layout]);

  useEffect(() => {
    componentIsMounted.current = true;
    return (() => {
      source.cancel();
      componentIsMounted.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyPoints, remainTime, googleObject]);

  const renderStoryPointChart = (data) => {
    if(!!googleObject && data.length > 0) {
      return attachGuideLine(startDate, endDate, getDataStoryPoint(data));
    }

    return [
      ['Date', 'Estimate Remain'],
      [new Date(2020, 0, 30), 0],
    ];
  };

  const renderRemainTimeChart = (data) => {
    if(!!googleObject && data.length > 0) {
      let maxVal = data[0].time_trackings.reduce((prev, curr) => {
        return prev + curr.remaining_time;
      }, 0);
      return attachGuideLine(startDate, endDate, getDataRemainTime(data), getHour(maxVal), null, [1, 2]);
    }

    return [
      ['Date', 'Estimate Remain'],
      [new Date(2020, 0, 30), 0],
    ];
  };

  const chartEvents = [
    {
      eventName: 'ready',
      callback() {
        if(!!window.google && !!window.google.visualization && !googleObject) {
          setGoogleObject(window.google);
        }
      }
    }
  ];

  const handleChangeLayout = event => {
    setLayout(event.target.value);
  };

  return (
    <ErrorBoundary>
      <Box m={0} p={0}>
        <FormControl>
          <RadioGroup row style={{ 'justifyContent': 'center', 'alignItems': 'center' }} onChange={handleChangeLayout} value={layout} >
            <FormControlLabel
              control={<Radio color="primary" value='remain_time' />}
              label='Remain Estimate Time'
            />
            <FormControlLabel
              control={<Radio color="primary" value='remain_story_points' />}
              label='Remain Story Points'
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box display="flex" justifyContent="center" flexWrap="wrap" m={0} p={0}>
        {
          layout === 'remain_story_points' ?
          <Chart
            width={'100%'}
            height={'400px'}
            chartType="ComboChart"
            loader={<>
              <Skeleton variant="rect" height={20} width="100%" style={{marginBottom: '0.5rem'}} />
              <Skeleton variant="rect" height={20} width="80%" style={{marginBottom: '0.5rem'}} />
              <Skeleton variant="rect" height={20} width="60%" />
            </>}
            data={renderStoryPointChart(storyPoints)}
            options={optionStoryPoint}
            chartEvents={chartEvents}
          />
          : layout === 'remain_time' ?
          <Chart
            width={'100%'}
            height={'400px'}
            chartType="ComboChart"
            loader={<>
              <Skeleton variant="rect" height={20} width="100%" style={{marginBottom: '0.5rem'}} />
              <Skeleton variant="rect" height={20} width="80%" style={{marginBottom: '0.5rem'}} />
              <Skeleton variant="rect" height={20} width="60%" />
            </>}
            data={renderRemainTimeChart(remainTime)}
            options={optionRemainTime}
            chartEvents={chartEvents}
          />
          : ''
        }
      </Box>
    </ErrorBoundary>
  );
}

const getDataStoryPoint = (data) => {
  let newArray = data.map(item => {
    return [
      new Date(item.date),
      item.remaining_story_points.reduce((acc, value) => {
        return acc + value.story_point
      }, 0)
    ]
  });
  newArray.unshift([
    {label: 'Date', type: 'datetime'},
    {label: 'Remain Story Points', type: 'number'},
  ]);
  return newArray;
};

const getDataRemainTime = (data) => {
  let newArray = data.map(item => {
    return [
      new Date(item.date),
      item.time_trackings.reduce((acc, value) => {
        return acc + getHour(value.remaining_time)
      }, 0),
      item.time_trackings.reduce((acc, value) => {
        return acc + getHour(value.time_spent)
      }, 0),
    ]
  });
  newArray.unshift([
    {label: 'Date', type: 'datetime'},
    {label: 'Remain Estimate', type: 'number'},
    {label: 'Time Spent', type: 'number'},
  ]);
  return newArray;
};

const attachGuideLine = (startDate, endDate, data, maxVal, keys, dt1Columns) => {
  let google = window.google;

  if(!google) {
    return [];
  }

  if(keys === null || keys === undefined) {
    keys = [[0, 0]];
  }

  if(dt1Columns === null || dt1Columns === undefined) {
    dt1Columns = [1];
  }

  if(maxVal === null || maxVal === undefined) {
    maxVal = (!!data && !!data[1] && !!data[1][1]) ? data[1][1] : 0;
  }

  let weekendItems = getWeekends(startDate, endDate);

  let guideLineTable = [
    [{label: 'Date', type: 'datetime'}, {label: 'avg', type: 'number'}],
    [startDate, maxVal]
  ];
  let days = getDaysBetween(startDate, endDate) / 24;
  let avgOffset = maxVal / days;
  for(let i = 0; i < weekendItems.length; i++) {
    let item = weekendItems[i];
    let dateItem = new Date(item);
    let dayIndex = (getDaysBetween(startDate, dateItem) / 24);
    if(dateItem.getDay() === 0) {
      dayIndex -= .5;
    } else {
      dayIndex += .5;
    }
    guideLineTable.push([item, maxVal - (dayIndex * avgOffset)]);
  }
  guideLineTable.push([endDate, 0]);

  // Create dateTable
  let joinedData = google.visualization.data.join(
    google.visualization.arrayToDataTable(data),
    google.visualization.arrayToDataTable(guideLineTable),
    'full',
    keys,
    dt1Columns,
    [1]
  );
  return dataTableToArray(joinedData);
}

const dataTableToArray = (dataTable) => {
  let google = window.google;

  if(!google) {
    return [];
  }

  if(!(dataTable instanceof google.visualization.DataTable)) {
    return [];
  }

  let arr = dataTable.wg.map(item => {
    return item.c.map(item => item.v);
  });

  //Add table label
  arr.unshift(dataTable.vg);

  return arr;
};

BurndownChart.propTypes = {
  user_ids: PropTypes.string.isRequired,
  sprint_id: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
};
