// static
:javascript
  import { useApi } from '~/Hooks/useApi'

// :hooks
:javascript
  const { signIn, status } = useApi()

Native.SafeAreaView.flex1
  Native.View.flex1.flexCol.itemsCenter.justifyCenter
    Native.Image.w48.h48.roundedFull(source=require('~/Assets/sunflower.png'))

    Native.View.p8
      Elements.Text.fontSemibold(h1) pushupbot

    if status === 'ready' || status === 'failure'
      Elements.Button(title='sign in to continue' onPress=()=>signIn())

    else
      Native.ActivityIndicator(size='large' color=Colors.gray800)
      Native.Text.textGray600= status

  if status === 'failure'
    Native.View.absolute.left0.right0.bottom0.bgRed500.p4
      Native.Text.textLg.textWhite Uh oh, we're unable to sign you in now.
      Native.SafeAreaView
