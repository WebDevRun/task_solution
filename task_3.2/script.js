const form = document.querySelector('form')
const routes = [
  {
    name: 'из A в B',
    times: [
      '2021-08-21 18:00:00',
      '2021-08-21 18:30:00',
      '2021-08-21 18:45:00',
      '2021-08-21 19:00:00',
      '2021-08-21 19:15:00',
      '2021-08-21 21:00:00',
    ],
    price: 700,
    travelTime: 50,
    timeZone: 'GMT+3',
    default: true,
  },
  {
    name: 'из B в A',
    times: [
      '2021-08-21 18:30:00',
      '2021-08-21 18:45:00',
      '2021-08-21 19:00:00',
      '2021-08-21 19:15:00',
      '2021-08-21 19:35:00',
      '2021-08-21 21:50:00',
      '2021-08-21 21:55:00',
    ],
    price: 700,
    travelTime: 50,
    timeZone: 'GMT+3',
  },
  {
    name: 'из A в B и обратно в А',
    price: 1200,
  },
]

function createElement(tagName, classNames = [], textContent = '') {
  const tag = document.createElement(tagName)
  if (classNames.length) {
    for (const className of classNames) {
      tag.classList.add(className)
    }
  }
  tag.textContent = textContent
  return tag
}

function createLabel(forAttr, textContent) {
  const label = createElement('label', [], textContent)
  label.htmlFor = forAttr
  return label
}

function createSelectTimesBack(id, name) {
  const selectTimesBack = createElement('select')
  selectTimesBack.id = id
  selectTimesBack.name = name
  return selectTimesBack
}

function createRouteOptions(routes) {
  return routes.map((route) => {
    if (route.default) return new Option(route.name, route.name, true, true)
    return new Option(route.name, route.name)
  })
}

function createTimeOptions(times, timeZone, route) {
  return times.map((item, index) => {
    const time = convertToLocalTime(item, timeZone)
    if (!index)
      return new Option(`${time}(${route})`, `${time}(${route})`, true, true)
    return new Option(`${time}(${route})`, `${time}(${route})`)
  })
}

function createTimeBackSelect(firstRoute, route) {
  const secondRoute = route.dependencies[1]
  const filteredTimesBack = filterTimesBack(
    firstRoute.times[0],
    secondRoute.times,
    firstRoute.travelTime
  )

  const routeOptions = createTimeOptions(
    filteredTimesBack,
    secondRoute.timeZone,
    secondRoute.name
  )

  labelTimeBack = createLabel('timeBack', 'Выберите обратное время')
  selectTimeBack = createSelectTimesBack('timeBack', 'timeBack')
  selectTimeBack.append(...routeOptions)
  selectTime.after(labelTimeBack, selectTimeBack)
  selectTime.addEventListener('change', selectTimeHandler)
}

function convertToLocalTime(time, timeZone) {
  const locaTime = new Date(`${time} ${timeZone}`)
  let hours = locaTime.getHours()
  hours = hours < 10 ? `0${hours}` : hours
  let minutes = locaTime.getMinutes()
  minutes = minutes < 10 ? `0${minutes}` : minutes
  return `${hours}:${minutes}`
}

function calculateTimeEnd(time, travelTime) {
  const date = new Date(time)
  return date.setMinutes(date.getMinutes() + travelTime)
}

function filterTimesBack(time, timesBack, travelTime) {
  const firstTime = calculateTimeEnd(time, travelTime)
  const filteredTimesBack = timesBack.filter((time) => {
    return new Date(time) > firstTime
  })
  return filteredTimesBack
}

function parseTimeSelecter(timeSelecterValue) {
  const time = timeSelecterValue.slice(0, 5)
  const route = timeSelecterValue.slice(6, -1)
  return [time, route]
}

function findTime(timeSelecterValue, routes) {
  const [selectedTime, selectedRoute] = parseTimeSelecter(timeSelecterValue)
  const findedRoute = routes.find((route) => route.name === selectedRoute)
  return findedRoute.times.find((time) =>
    convertToLocalTime(time, findedRoute.timeZone).includes(selectedTime)
  )
}

function selectRouteHandler(event) {
  const targetValue = event.target.value
  const route = routes.find((route) => route.name === targetValue)
  const firstRoute = route.dependencies ? route.dependencies[0] : route
  const timeOptions = createTimeOptions(
    firstRoute.times,
    firstRoute.timeZone,
    firstRoute.name
  )

  if (route.dependencies) {
    createTimeBackSelect(firstRoute, route)
  }

  if (!route.dependencies && labelTimeBack && selectTimeBack) {
    selectTime.removeEventListener('change', selectTimeHandler)
    labelTimeBack.remove()
    selectTimeBack.remove()
  }

  selectTime.innerHTML = ''
  selectTime.append(...timeOptions)
  formValues.price = firstRoute === route ? firstRoute.price : route.price
  formValues.travelTime =
    firstRoute === route ? route.travelTime : firstRoute.travelTime
}

function selectTimeHandler(event) {
  const targetTime = event.target.value
  const findedTime = findTime(targetTime, routes)
  const selectedRoute = selectRoute.value
  const routeBack = routes.find((route) => route.name === selectedRoute)
  const filteredTimesBack = filterTimesBack(
    findedTime,
    routeBack.dependencies[1].times,
    routeBack.dependencies[1].travelTime
  )

  const routeOptions = createTimeOptions(
    filteredTimesBack,
    routeBack.dependencies[1].timeZone,
    routeBack.dependencies[1].name
  )
  selectTimeBack.innerHTML = ''
  selectTimeBack.append(...routeOptions)
}

const [selectRoute, selectTime, inputNumber] = form
const formValues = {}
const routeOptions = createRouteOptions(routes)

let labelTimeBack, selectTimeBack, outputMessage

routes[2].dependencies = [routes[0], routes[1]]
selectTime.innerHTML = ''
selectRoute.append(...routeOptions)

for (const route of routes) {
  if (route.default) {
    const targetRoute = route.dependencies ? route.dependencies[0] : route
    const { times, name, timeZone } = targetRoute
    const timeOptions = createTimeOptions(times, timeZone, name)

    if (route.dependencies) {
      createTimeBackSelect(targetRoute, route)
    }

    selectTime.append(...timeOptions)
    formValues.price = targetRoute === route ? targetRoute.price : route.price
    formValues.travelTime =
      targetRoute === route ? route.travelTime : targetRoute.travelTime
  }
}

selectRoute.addEventListener('change', selectRouteHandler)

form.addEventListener('submit', (event) => {
  event.preventDefault()
  const formData = new FormData(event.target)
  let findedTime, totalTravelTime

  for (const [key, value] of formData) {
    formValues[key] = value
  }
  const findedRoute = routes.find((route) => route.name === formValues.route)
  totalTravelTime = formValues.travelTime

  if (findedRoute.dependencies) {
    findedTime = findTime(formValues.timeBack, routes)
    totalTravelTime *= 2
  } else {
    findedTime = findTime(formValues.time, routes)
  }

  const timeEnd = convertToLocalTime(
    new Date(calculateTimeEnd(findedTime, formValues.travelTime)),
    routes[0].timeZone
  )
  const outputMessageText = `Вы выбрали ${
    formValues.ticket_count
  } билета по маршруту ${formValues.route} стоимостью ${
    formValues.price * formValues.ticket_count
  }.
  Это путешествие займет у вас ${totalTravelTime} минут.
  Теплоход отправляется в ${formValues.time.slice(
    0,
    5
  )}, а прибудет в ${timeEnd}.`

  if (outputMessage) {
    outputMessage.textContent = outputMessageText
    return
  }
  outputMessage = createElement('div', ['output_message'], outputMessageText)
  form.after(outputMessage)
})
