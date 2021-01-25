// :static
:javascript
  import SplashScreen from 'react-native-splash-screen'
  import { QueryCache, ReactQueryCacheProvider } from 'react-query'
  import { NavigationContainer } from '@react-navigation/native'
  import { RootNavigator } from '~/Navigators/RootNavigator'
  import { ApiProvider } from '~/Hooks/useApi'

  const queryCache = new QueryCache()

// :hooks
:javascript
  useEffect(() => {
    SplashScreen.hide()
  }, [])

NavigationContainer
  ApiProvider
    ReactQueryCacheProvider(queryCache=queryCache)
      RootNavigator
