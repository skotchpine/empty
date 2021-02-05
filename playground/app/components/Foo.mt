component
  -
    const [time, setTime] = React.useState(3)
    const [name, setName] = React.useState('Laviticus')
    const [corrected, setCorrected] = React.useState(false)

    React.useEffect(() => {
      if (time < 1) return
      setTimeout(() => setTime(time - 1), 1000)
    }, [time])

  if corrected
    h1 Sorry about that, ${name}, thanks for correcting me.
  else
    h1 Hello, ${name}!

  if time > 0
    p Correct me in ${time}...
  else
    p
      | Actually, my name is
      input(value=name onChange=(e)=>setName(e.target.value))
      | .
    button(onClick=()=>setCorrected(true)) Correct me!

