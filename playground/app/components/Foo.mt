:js
  import {useState, useEffect} from 'react'

component(defaultTime=3 defaultName='Vesuvious')
  unless corrected
    h1 Hello, ${name}!

    if time > 0
      p Correct me in ${time}...
    else
      p
        | Actually, my name is
        input(value=name onChange=(e)=>setName(e.target.value))
        | .
      button(onClick=()=>setCorrected(true)) Correct me!

  else
    h2 Sorry about that, ${name}, thanks for correcting me.

  :js
    const [time, setTime] = useState(defaultTime)
    const [name, setName] = useState(defaultName)
    const [corrected, setCorrected] = useState(false)

    useEffect(() => {
      if (time < 1) return
      setTimeout(() => setTime(time - 1), 1000)
    }, [time])

