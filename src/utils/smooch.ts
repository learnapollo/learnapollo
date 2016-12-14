import {getStoredState} from './statestore'

export function initSmooch(): void {
  if (!Smooch) {
    return
  }

  const userData = getStoredState().user

  Smooch.init({
    appToken: '4ly1eiob2s078qq6w6wsk9a1r',
    email: userData ? userData.email : undefined,
    givenName: userData ? userData.name : undefined,
  })
}
