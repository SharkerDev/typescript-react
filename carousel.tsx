import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import { State as RootState } from 'reducers';
import { APITournament } from 'models';
import TourneyCard from './TourneyCard';
import styles from './styles.module.scss';

type Props = {
  isFetching: boolean;
  tournaments: APITournament[];
};

const width = 220;

const getWindowWidth = (changeWidth: (n: number) => void) =>
  throttle(() => {
    changeWidth(window.innerWidth);
  }, 500);

const Carusel = ({ tournaments, isFetching }: Props) => {
  const [windowWidth, changeWidth] = useState<number>(0);

  useEffect(() => {
    changeWidth(window.innerWidth);
    window.addEventListener('resize', getWindowWidth(changeWidth), true);
    return window.removeEventListener('resize', getWindowWidth(changeWidth));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerWidth = windowWidth - 255;
  const quantitySlides = Math.round((containerWidth / width) * 10) / 10;

  return !windowWidth || isFetching ? null : (
    <CarouselProvider
      naturalSlideWidth={ 220 }
      naturalSlideHeight={ 66 }
      visibleSlides={ quantitySlides }
      totalSlides={ tournaments.length }
      className={ styles.carusel }
      dragEnabled={ false } >
      <ButtonBack className={ styles.btnBack }>
        <i className='material-icons'>arrow_left</i>
      </ButtonBack>
      <Slider>
        { tournaments.map((tournament, i: number) => (
          <Slide index={ i } key={ tournament.id }>
            <TourneyCard tournament={ tournament } />
          </Slide>
        )) }
      </Slider>
      <ButtonNext className={ styles.btnNext }>
        <i className='material-icons'>arrow_right</i>
      </ButtonNext>
    </CarouselProvider>
  );
};

const mapStateToProps = ({ site: { tournaments } }: RootState) => ({
  tournaments: tournaments.list,
  isFetching: tournaments.isFetching,
});

export default connect(mapStateToProps)(Carusel);