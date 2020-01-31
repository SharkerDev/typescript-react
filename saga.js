import { takeEvery, put, call, all } from 'redux-saga/effects'
import { createRoutine, Routine } from 'redux-saga-routines'

import { APIError, APIInternationalRating } from 'models/APIModel'
import requestPublic from 'utils/requestPublic'

type ResponseType = APIError | { data: APIInternationalRating[] }[]
type Source = 'ATP' | 'WTA'
export const action: Routine = createRoutine('GET_INTERNATIONAL_RATINGS')

function getInternationalRatings(source: Source) {
  return requestPublic({ route: `/ratings/foreign-src-ratings/${source}` })
}

function* handler() {
  try {
    const response: ResponseType = yield all([
      call(getInternationalRatings, 'ATP'),
      call(getInternationalRatings, 'WTA')
    ])
    if ('errors' in response) throw Error(response.message)
    const [{ data: ATP }, { data: WTA }] = response
    yield put(action.success({ ATP, WTA }))
  } catch (error) {
    yield put(action.failure(error.message))
  }
}

export function* saga() {
  yield takeEvery(action.TRIGGER, handler)
}