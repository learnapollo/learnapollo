import {getStoredState} from './statestore'

export function initSmooch(): Promise<void> {
  if (!window.Smooch || navigator.userAgent === 'SSR') {
    return Promise.resolve()
  }

  const userData = getStoredState().user

  return Smooch.init({
    appToken: '4ly1eiob2s078qq6w6wsk9a1r',
    email: userData ? userData.email : undefined,
    givenName: userData ? userData.name : undefined,
  }) as Promise<void>
}
