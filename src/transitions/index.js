import Fade from './Fade'
// import Main from './Main'
import Stories from './Stories'

const transitions = {
  main: {
    ...Fade
  },
  case: {
    ...Stories
  },
  about: {
    ...Fade
  }
}

export default transitions
