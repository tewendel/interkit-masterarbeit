const genericErrorHandler = error => {
  let msg = ''
  if (!error) {
    msg = 'unknown error'
  } else {
    if (error.error) msg += error.error + '\n'
    if (error.errorMessage) msg += error.errorMessage + '\n'
    if (error.message) msg += error.message + '\n'
  }
  window.alert(msg)
  console.error(error)
}

const errorify = response => {
  if (!response.errors) return
  if (Array.isArray(response.errors)) {
    if (response.errors.length === 0) return
    throw response.errors[0]
  } else {
    throw response.errors
  }
}

export {
  genericErrorHandler,
  errorify
}
