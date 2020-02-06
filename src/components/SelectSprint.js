import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import { KPIStoreContext } from '../contexts/KPIStore';
import GetSprints from '../utils/GetSprints';
import axios, { CancelToken } from 'axios';

export default function SelectSprint({...props}) {
  const source = CancelToken.source();
  const { boardSprints: [boardSprints, setBoardSprints] } = useContext(KPIStoreContext);
  const componentIsMounted = useRef(true);

  useEffect(() => {
    if(boardSprints.length === 0) {
      GetSprints({ cancelToken: source.token })
      .then((results) => {
        if( componentIsMounted.current ) {
          setBoardSprints(results.data);
        }
      }).catch((e) => {
        if (!axios.isCancel(e)) {
          console.log("Error: ", e);
        }
      });
    }

    return (() => {
      source.cancel();
      componentIsMounted.current = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardSprints]);

  if(boardSprints.length === 0) {
    return 'Loading Sprint';
  }

  return (
    <Select
      native
      {...props}
    >
      {boardSprints.map((item, idx) => {
        return <option key={idx} value={item.id}>{`${item.name} - ${item.state}`}</option>
      })}
    </Select>
  );
}

SelectSprint.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
};
