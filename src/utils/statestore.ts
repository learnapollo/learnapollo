import * as Immutable from 'immutable'
import {Track, tracks} from './content'

interface UserData {
  projectId: string
  email: string
  name: string
}

export interface StoredState {
  hasRead: { [key: string]: boolean }
  user: UserData | null
  skippedAuth: boolean
  initialLoadTimestamp: number | null
  selectedTrack: Track
}

const initialState: StoredState = {
  hasRead: {},
  user: null,
  skippedAuth: false,
  initialLoadTimestamp: null,
  selectedTrack: tracks[tracks.findIndex((item) => item.alias === 'tutorial-react')],
}

let state: StoredState = window.localStorage.hasOwnProperty('learnapollo_state')
  ? JSON.parse(window.localStorage.getItem('learnapollo_state')!) as StoredState
  : initialState

export function getStoredState(): StoredState {
  return state
}

export function update(keyPath: string[], value: any): StoredState {
  state = Immutable.fromJS(state).setIn(keyPath, value).toJS() as StoredState
  window.localStorage.setItem('learnapollo_state', JSON.stringify(state))
  return state
}
