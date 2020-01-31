import React, { useEffect, useState, useMemo } from 'react';
import { withStyles, WithStyles } from '@material-ui/core';
import useResizeObserver from 'use-resize-observer';
import cn from 'classnames';
import debounce from 'lodash/debounce';

import { APILocationSimple } from 'src/models';
import styles from './styles';

type Props = {
  locations: APILocationSimple[];
} & WithStyles<typeof styles>;

type ReturnType = {
  width: number;
  height: number;
  ref: React.RefObject<HTMLElement>;
};

const useResizeDebounce = (wait: number): ReturnType => {
  const [size, setSize] = useState<Omit<ReturnType, 'ref'> | {}>({});
  const onResize = useMemo(() => debounce(setSize, wait, { leading: true }), [wait]);
  const { ref } = useResizeObserver({ onResize });

  return { ref, ...size } as ReturnType;
};

const LocationsList = ({ locations, classes }: Props) => {
  const [visibleLocations, setVisibleLocationsCount] = useState<number>(locations.length);
  const { ref, height = 1 } = useResizeDebounce(400);

  useEffect(() => {
    if (ref.current) {
      for (
        let el = ref.current.firstElementChild, visibleElements = 0;
        el;
        el = el.nextElementSibling, visibleElements++
      ) {
        if (el && (el as HTMLElement).offsetTop > height) {
          setVisibleLocationsCount(visibleElements);
          break;
        }
      }
    }
  }, [height, ref, locations.length]);

  const hiddenLocations = locations.length - visibleLocations;

  return (
    <ul className={ cn(classes.locations, { column: hiddenLocations }) } ref={ ref as any }>
      { locations.map(el => (
        <li key={ el.id } title={ el.name }>
          { el.name }
        </li>
      )) }
      { hiddenLocations ? <li className='hidden-counts'>{`+${ hiddenLocations }`}</li> : null }
    </ul>
  );
};

export default withStyles(styles)(LocationsList);
